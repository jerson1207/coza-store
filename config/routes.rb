Rails.application.routes.draw do

  devise_for :users  
  namespace :admin do
    resources :orders
    resources :products, except: [:show] do
      resources :stocks
    end
    resources :categories, except: [:show]
    resources :users, only: [:index]

  end
  
  devise_for :admins
  get "up" => "rails/health#show", as: :rails_health_check

  root "home#index"
  
  authenticated :admin_user do
    root to: 'admin#index', as: :root_admin
  end

  get 'admin' => 'admin#index'
  get 'filter' => 'admin#filter'


  # resources :categories, only: [:show]
  resources :categories do
    resources :products, only: [:index]
  end
  resources :products, only: [:index, :show]
  resources :features, only: [:index]
  resources :blog, only: [:index]
  get "about" => "pages#about" 
  get "contact" => "pages#contact"

  get "cart" => "carts#show"
  post "checkout" => "checkouts#create"
  get "success" => "checkouts#success"
  get "cancel" => "checkouts#cancel"
  get "my_order" => "pages#my_order"
  

end
