class CheckoutsController < ApplicationController
  def create
    stripe_secret_key = Rails.application.credentials.dig(:stripe, :secret_key)
    Stripe.api_key = stripe_secret_key
      
    cart = params[:cart]
    email_params = params[:email]
    address_params = params[:address]
    
    line_items = cart.map do |item|
      product = Product.find(item["id"])
      product_stock = product.stocks.find{ |ps| ps.size == item["size"] }

      if product_stock.amount < item["quantity"].to_i
        render json: { error: "Not enough stock for #{product.name} in size #{item["size"]}. Only #{product_stock.amount} left." }, status: 400
        return
      end

      { 
        quantity: item["quantity"].to_i,
        price_data: { 
          product_data: {
            name: item["name"],
            metadata: { product_id: product.id, size: item["size"], product_stock_id: product_stock.id }
          },
          currency: "usd",
          unit_amount: item["price"].to_f
        }
      } 
    end

    session = Stripe::Checkout::Session.create(
      mode: "payment",
      line_items: line_items,
      success_url: success_url(line_items, email_params, address_params),
      cancel_url: "http://localhost:3000/cancel",
      shipping_address_collection: { 
        allowed_countries: ['US', 'CA']
      }
    )
    
    render json: { url: session.url }
  end

  def success
    line_items = JSON.parse(params[:line_items])
    email = JSON.parse(params[:email])
    address = JSON.parse(params[:address])
    customer_email = current_user.email
    address = address
    order = Order.new(customer_email: email, address: address, fulfilled: false)
    order.user = current_user
    if order.save
      line_items.each do |item_params|
        product_id = item_params["price_data"]["product_data"]["metadata"]["product_id"]
        quantity = item_params["quantity"]
        size = item_params["price_data"]["product_data"]["metadata"]["size"]
        price = item_params["price_data"]["unit_amount"]
        # https://docs.stripe.com/currencies#zero-decimal

        order_item = OrderItem.new(
          order_id: order.id,
          product_id: product_id,
          user_id: current_user.id,
          quantity: quantity,
          price: price,
          size: size
        )

        unless order_item.save
          # Handle error if order item creation fails
          render json: { error: "Failed to create order item-----------" }, status: :unprocessable_entity
          return
        end
      end
      
      order_total(order)
      render :success
    else
      # Handle error if order creation fails
      render json: { error: "Failed to create ---------" }, status: :unprocessable_entity
    end
  end

  def cancel
    render :cancel
  end

  def order_total(order)
    total = []
    order.order_items.each do |item|
      total_item = item.quantity * item.price
      total << total_item
    end
    order.update(total: total.sum)
  end

  private

  def success_url(line_items, email_params, address_params)
    success_url = "http://localhost:3000/success"
    success_url += "?line_items=#{URI.encode_www_form_component(line_items.to_json)}"
    success_url += "&email=#{URI.encode_www_form_component(email_params.to_json)}"
    success_url += "&address=#{URI.encode_www_form_component(address_params.to_json)}"
    success_url
  end
end
