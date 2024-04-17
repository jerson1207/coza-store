class HomeController < ApplicationController
  def index
    @categories = Category.take(3)
    @products = Product.take(5)
  end

  def shop
  end
end
