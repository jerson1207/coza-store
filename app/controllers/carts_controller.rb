class CartsController < ApplicationController
  def show
    @Order = Order.all
  end
end