

from rest_framework import serializers
from .models import *

class ProductSerializer(serializers.ModelSerializer):
    sales_price = serializers.SerializerMethodField(read_only= True)
    class Meta:
        model = Products
        fields = '__all__'

    def create(self, validated_data):
        # Extract and remove 'sales_price' from validated_data as it's not a model field
        sales_price = validated_data.pop('sales_price', None)

        # Create the product instance using the remaining validated data
        product = Products.objects.create(**validated_data)

        # Set the 'sales_price' manually if it's provided
        if sales_price is not None:
            product.sales_price = sales_price
            product.save()

        return product
    
    def get_sales_price(self, obj):
        return obj.calculate_sales_price()
    

class CustomerSerializer(serializers.ModelSerializer):
    photo_url = serializers.SerializerMethodField()

    def get_photo_url(self, obj):
        if obj.photo:
            return obj.photo.url
        return None

    class Meta:
        model = Customer
        # fields = '_all_'
        fields = ['id', 'name', 'address', 'city', 'state', 'zip_code', 'country', 'photo','photo_url']

        
class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model=Contact
        # fields='_all_'
        fields = ['id', 'customer_id', 'email', 'mobile']

class OrderProductSerializer(serializers.ModelSerializer):
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['product'] = ProductSerializer(instance.product).data

        return representation

    
    class Meta:
        model = OrderProduct
        fields = '__all__'

class SaleOrderSerializer(serializers.ModelSerializer):
    products = ProductSerializer(many=True, read_only=True)
    order_products = OrderProductSerializer(many=True, write_only=True)

    class Meta:
        model = SaleOrder
        fields = '__all__'

    def to_representation(self, instance):
        representation = super().to_representation(instance)

        # Include serialized data for customer
        representation['customer'] = CustomerSerializer(instance.customer).data

        # Include serialized data for order products
        order_products_data = OrderProductSerializer(instance.order_products.all(), many=True).data
        representation['order_products'] = order_products_data

        return representation

    
    
    # def create(self, validated_data):
    #     order_products_data = validated_data.pop('order_products')
    #     sale_order = SaleOrder.objects.create(**validated_data)

    #     total_price = 0  # Initialize total price

    #     for order_product_data in order_products_data:
    #         # order_product_data['sale_order'] = sale_order
    #         product = order_product_data['product']
    #         quantity = order_product_data['quantity']
    #         discount=order_product_data['discount']
    #         additional_taxes=order_product_data['additional_taxes']
    #         subtotal_price = (product.sales_price * quantity)+(product.sales_price*additional_taxes*quantity)-discount

    #         total_price += subtotal_price  # Update total price

    #         OrderProduct.objects.create(
    #             sale_order=sale_order,
    #             product=product,
    #             quantity=quantity,
    #             discount=discount,
    #             additional_tax=additional_taxes,
    #             subtotal_price=subtotal_price
    #         )

    #     sale_order.total_price = total_price  # Set the total price
    #     sale_order.save()

    #     return sale_order

    def create(self, validated_data):
        order_products_data = validated_data.pop('order_products')
        sale_order = SaleOrder.objects.create(**validated_data)

        total_price = 0  # Initialize total price

        for order_product_data in order_products_data:
            product = order_product_data['product']
            quantity = order_product_data['quantity']
            discount = order_product_data['discount']
            additional_taxes = order_product_data['additional_taxes']  # Corrected field name
            subtotal_price = (product.sales_price * quantity) + (product.sales_price * additional_taxes * quantity) - discount

            total_price += subtotal_price  # Update total price

            OrderProduct.objects.create(
                sale_order=sale_order,
                product=product,
                quantity=quantity,
                discount=discount,
                additional_taxes=additional_taxes,  # Corrected field name
                subtotal_price=subtotal_price
            )

        sale_order.total_price = total_price  # Set the total price
        sale_order.save()

        return sale_order

