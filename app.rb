require 'sinatra'
require 'sinatra/reloader'
require 'stripe'
require 'dotenv/load'

configure :development, :test do
  require 'pry'
end

Dir[File.join(File.dirname(__FILE__), 'lib', '**', '*.rb')].each do |file|
  require file
  also_reload file
end

set :publishable_key, ENV['STRIPE_PUBLISHABLE_KEY']
set :secret_key, ENV['STRIPE_SECRET_KEY']

Stripe.api_key = settings.secret_key

get '/' do
  @title = "I'm a test Stripe app"
  erb :index
end

post '/charge' do
  # Amount in cents
  binding.pry
 @amount = params[:amount].gsub(",", "")
  @pretty_amount = "$#{params[:amount]}"

 customer = Stripe::Customer.create(
   email: 'customer@example.com',
   source: params[:stripeToken]
 )

 charge = Stripe::Charge.create(
   amount:       @amount,
   description:  'Sinatra Charge',
   currency:     'usd',
   customer:     customer.id
 )

 erb :charge
end

error Stripe::CardError do
  env['sinatra.error'].message
end
