class Order < ApplicationRecord
  has_many :order_products
  belongs_to :user
  has_many :order_items, dependent: :destroy
end
