class Product < ApplicationRecord
  belongs_to :category
  has_many_attached :images, dependent: :destroy
  has_many :stocks, dependent: :destroy
  has_many :order_product, dependent: :destroy
end
