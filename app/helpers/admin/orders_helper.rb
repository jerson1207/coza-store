module Admin::OrdersHelper
  def item_name(id)
    item = OrderItem.find id
    product = Product.find(item.id)
    product.name
  end

  def item_size(id)
    item = OrderItem.find id
    item.size
  end

  def item_price(id)
    item = OrderItem.find id
    "$ #{item.price}"
  end

  def item_quantity(id)
    item = OrderItem.find id
    item.quantity
  end

  def item_total(id)
    item = OrderItem.find id
    quantity = item.quantity
    price = item.price
    total = quantity * price
    "$ #{total}"
  end

  def grand_total(order)
    order_items = order.order_items.all
    grand_total = 0
    
    order_items.each do |item|
      total = item.quantity * item.price
      grand_total += total
    end
    
    "$ #{grand_total}"
  end

  def order_status(order)
    status = order.fulfilled
    return "Fulfilled" if status
    "Not Fullfilled"
  end
end
