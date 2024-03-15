class Admin::UsersController < AdminController
  def index
    @admin_users = User.all
  end
end