class AdminController < ApplicationController
  layout 'admin'
  before_action :authenticate_admin!

  def filter
    
  end
  
  def index
    @start_dates = params[:start_date].present? ?  params[:start_date] : Date.today.beginning_of_month.to_s
    @end_dates = params[:end_date].present? ?  params[:end_date] : Date.today.to_s
    
    @min_date = Order.minimum(:created_at).to_date.to_s
    @max_date = Date.today.to_s

    start_date = params[:start_date].present? ? Date.parse(params[:start_date]).beginning_of_day : Date.today.beginning_of_month
    end_date = params[:end_date].present? ? Date.parse(params[:end_date]).end_of_day : Date.today

    @orders = Order.where(fulfilled: false)
                   .where(created_at: start_date..end_date)
                   .order(created_at: :desc)
    @quick_stats = { 
      sales: Order.where(created_at: Time.now.midnight..Time.now).count,
      revenue: Order.where(created_at: Time.now.midnight..Time.now).sum(:total)&.round(),
      avg_sale: Order.where(created_at: Time.now.midnight..Time.now).average(:total)&.round(),
      per_sale: OrderProduct.joins(:order).where(orders: { created_at: Time.now.midnight..Time.now })&.average(:quantity)
    }
    @orders_by_day = Order.where(created_at: start_date..end_date)
    @orders_by_day = @orders_by_day.group_by { |order| order.created_at.to_date }
    @revenue_by_day = @orders_by_day.map { |day, orders| [day.to_s, orders.sum(&:total)] }
  end

end