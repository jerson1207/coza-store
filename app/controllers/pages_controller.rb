class PagesController < ApplicationController
  def my_order
    @orders = Order.where(user_id: current_user.id)
  end

  def about

  end

  def contact
    
  end
end
