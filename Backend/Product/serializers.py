

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

class SaleOrderItemSerializer(serializers.ModelSerializer):
    sale_order = serializers.PrimaryKeyRelatedField(queryset=SaleOrder.objects.all())
    product = serializers.PrimaryKeyRelatedField(queryset=Products.objects.all())
    quantity = serializers.IntegerField()
    unit_price = serializers.DecimalField(max_digits=10, decimal_places=2,read_only=True)
    taxes = serializers.DecimalField(max_digits=10, decimal_places=2,read_only=True)
    discount = serializers.DecimalField(max_digits=10, decimal_places=2)
    total = serializers.DecimalField(max_digits=10, decimal_places=2,read_only=True)

    class Meta:
        model = SaleOrder.products.through
        fields = ['id','sale_order','product', 'quantity', 'discount','unit_price','taxes','total']

class SaleOrderSerializer(serializers.ModelSerializer):
    customer = serializers.PrimaryKeyRelatedField(queryset=Customer.objects.all())
    products = serializers.PrimaryKeyRelatedField(queryset=Products.objects.all(), many=True)
    

    class Meta:
        model = SaleOrder
        fields = '__all__'
class SaleOrderItemSerializer(serializers.ModelSerializer):
    sale_order = serializers.PrimaryKeyRelatedField(queryset=SaleOrder.objects.all())
    product = serializers.PrimaryKeyRelatedField(queryset=Products.objects.all())
    quantity = serializers.IntegerField()
    unit_price = serializers.DecimalField(max_digits=10, decimal_places=2,read_only=True)
    taxes = serializers.DecimalField(max_digits=10, decimal_places=2,read_only=True)
    discount = serializers.DecimalField(max_digits=10, decimal_places=2)
    total = serializers.DecimalField(max_digits=10, decimal_places=2,read_only=True)

    class Meta:
        model = SaleOrder.products.through
        fields = ['id','sale_order','product', 'quantity', 'discount','unit_price','taxes','total']

# class SaleOrderSerializer(serializers.ModelSerializer):
#     customer = serializers.PrimaryKeyRelatedField(queryset=Customer.objects.all())
#     products = serializers.PrimaryKeyRelatedField(queryset=Products.objects.all(), many=True)

#     class Meta:
#         model = SaleOrder
#         fields = '__all__'
        
class SaleOrderSerializer(serializers.ModelSerializer):
    customer_name = serializers.SerializerMethodField()
    product_names = serializers.SerializerMethodField()

    def get_customer_name(self, obj):
        return obj.customer.name if obj.customer else None

    def get_product_names(self, obj):
        return [product.product_name for product in obj.products.all()]

    class Meta:
        model = SaleOrder
        fields = ['id', 'customer', 'customer_name', 'products', 'product_names', 'invoice_address', 'delivery_address', 'expiration_date', 'payment_terms', 'custom_id']
