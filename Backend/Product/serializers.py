

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

