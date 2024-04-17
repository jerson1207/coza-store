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


  # resources :categories, only: [:show]
  resources :categories do
    resources :products, only: [:index]
  end
  resources :products, only: [:index, :show]

  get "cart" => "carts#show"
  post "checkout" => "checkouts#create"
  get "success" => "checkouts#success"
  get "cancel" => "checkouts#cancel"
  get "my_order" => "pages#my_order"

end
