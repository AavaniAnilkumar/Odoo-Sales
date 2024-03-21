from rest_framework import serializers
from .models import *

class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model =Product
        fields ='__all__'


class OrderProductSerializer(serializers.ModelSerializer):
    
    
    class Meta:
        model = OrderProduct
        fields = '__all__'

    def to_representation(self, instance):
         representation = super().to_representation(instance)
         representation['product'] = ProductSerializer(instance.product).data

         return representation


    def create(self, validated_data):
        product = validated_data['product']
        unit_price = validated_data['unit_price']
        quantity = validated_data['quantity']
        discount = validated_data.get('discount', 0)  # Default to 0 if discount is not provided
        additional_taxes = validated_data.get('additional_taxes', 0)  # Default to 0 if additional_taxes is not provided
        
        subtotal_price = (unit_price * quantity) + (unit_price * additional_taxes * quantity) - discount
        
        # Set subtotal_price in validated data
        validated_data['subtotal_price'] = subtotal_price
        
        return super().create(validated_data)
    

class SaleOrderSerializer(serializers.ModelSerializer):
    products = ProductSerializer(many=True, read_only=True)

    class Meta:
        model = SaleOrder
        fields = '__all__'

    def to_representation(self, instance):
        representation = super().to_representation(instance)

        representation['id'] = f'S{str(instance.id).zfill(4)}'

        # Include serialized data for customer
        representation['customer'] = CustomerSerializer(instance.customer).data

        # Include serialized data for order products
        order_products_data = OrderProductSerializer(instance.order_products.all(), many=True).data
        representation['order_products'] = order_products_data

        return representation

    def create(self, validated_data):
        sale_order = SaleOrder.objects.create(**validated_data)

        total_price = 0  

        # Filter OrderProducts not associated with any SaleOrder
        order_products_to_update = OrderProduct.objects.filter(sale_order__isnull=True)

        for order_product in order_products_to_update:
            # Update the SaleOrder field in OrderProduct
            order_product.sale_order = sale_order
            order_product.save()

            subtotal_price = order_product.subtotal_price
            if subtotal_price is not None:
                total_price += subtotal_price  

        sale_order.total_price = total_price  
        sale_order.save()

        return sale_order

