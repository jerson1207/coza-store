# db/seeds.rb
# category
categories_info = [
  { name: "Women", description: "Spring 2024", image: "category/women.jpg" },
  { name: "Men", description: "Spring 2024", image: "category/men.jpg" },
  { name: "Bag", description: "Spring 2024", image: "category/bag.jpg" },
  { name: "Shoes", description: "Spring 2024", image: "category/shoes.jpg" },
  { name: "Watches", description: "Spring 2024", image: "category/watches.jpg" }
]

categories_info.each do |info|
  category = Category.find_or_initialize_by(name: info[:name])
  category.description = info[:description]

  if category.new_record?
    begin
      category.save!
    rescue StandardError => e
      puts "Error saving new category '#{category.name}': #{e.message}"
      next
    end
  end

  image_path = Rails.root.join('app', 'assets', 'images', info[:image])

  unless File.exist?(image_path)
    puts "Image file not found: #{image_path}"
    next
  end

  category.image.attach(io: File.open(image_path), filename: File.basename(image_path))
end

# product
women_category = Category.find_by(name: 'Women')
women_category.products.create([
  { 
    name: 'Esprint Ruffle Shirt', 
    description: 'Description for Product 1',
    price: 100, # Adjust the price accordingly
    active: true,
    images: [
      { io: File.open(Rails.root.join('app/assets/images/products/product-women-01.jpg')), filename: 'product-01.jpg' }
    ]
  },
  { 
    name: 'Herschel supply', 
    description: 'Description for Product 1',
    price: 100, # Adjust the price accordingly
    active: true,
    images: [
      { io: File.open(Rails.root.join('app/assets/images/products/product-women-02.jpg')), filename: 'product-01.jpg' }
    ]
  },
  { 
    name: 'Product 1', 
    description: 'Description for Product 1',
    price: 100, # Adjust the price accordingly
    active: true,
    images: [
      { io: File.open(Rails.root.join('app/assets/images/products/product-women-03.jpg')), filename: 'product-01.jpg' }
    ]
  },
  { 
    name: 'Product 1', 
    description: 'Description for Product 1',
    price: 100, # Adjust the price accordingly
    active: true,
    images: [
      { io: File.open(Rails.root.join('app/assets/images/products/product-women-04.jpg')), filename: 'product-01.jpg' }
    ]
  },
  { 
    name: 'Product 1', 
    description: 'Description for Product 1',
    price: 100, # Adjust the price accordingly
    active: true,
    images: [
      { io: File.open(Rails.root.join('app/assets/images/products/product-women-05.jpg')), filename: 'product-01.jpg' }
    ]
  },
  { 
    name: 'Product 1', 
    description: 'Description for Product 1',
    price: 100, # Adjust the price accordingly
    active: true,
    images: [
      { io: File.open(Rails.root.join('app/assets/images/products/product-women-06.jpg')), filename: 'product-01.jpg' }
    ]
  },
  { 
    name: 'Product 1', 
    description: 'Description for Product 1',
    price: 100, # Adjust the price accordingly
    active: true,
    images: [
      { io: File.open(Rails.root.join('app/assets/images/products/product-women-07.jpg')), filename: 'product-01.jpg' }
    ]
  },
  { 
    name: 'Product 1', 
    description: 'Description for Product 1',
    price: 100, # Adjust the price accordingly
    active: true,
    images: [
      { io: File.open(Rails.root.join('app/assets/images/products/product-women-08.jpg')), filename: 'product-01.jpg' }
    ]
  },
  { 
    name: 'Product 1', 
    description: 'Description for Product 1',
    price: 100, # Adjust the price accordingly
    active: true,
    images: [
      { io: File.open(Rails.root.join('app/assets/images/products/product-women-09.jpg')), filename: 'product-01.jpg' }
    ]
  },
  { 
    name: 'Product 1', 
    description: 'Description for Product 1',
    price: 100, # Adjust the price accordingly
    active: true,
    images: [
      { io: File.open(Rails.root.join('app/assets/images/products/product-women-10.jpg')), filename: 'product-01.jpg' }
    ]
  }
])

# Stock
Product.all.each do |product|
  Stock.create(product: product, size: 'Size S', amount: 100)
  Stock.create(product: product, size: 'Size M', amount: 100)
  Stock.create(product: product, size: 'Size L', amount: 100)
  Stock.create(product: product, size: 'Size XL', amount: 100)
end

# Admin/Users
Admin.create(email: "admin@test.com", password: "qwerty", password_confirmation: "qwerty")
5.times do |i|
  User.create(email: "user#{i + 1}@test.com", password: "qwerty", password_confirmation: "qwerty")
end