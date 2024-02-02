from django.db import models

# Create your models here.
from django.db import models

# Create your models here.

class Products(models.Model):
    PRODUCT_TYPES =[
        ('consumable', 'Consumable'),
        ('service', 'Service'),
        ('event', 'Event')
    ]

    product_name = models.CharField(max_length=255)
    product_image = models.ImageField(upload_to='product_images/', null=True, blank=True)
    product_type = models.CharField(max_length=20, choices=PRODUCT_TYPES)
    
    customer_tax = models.DecimalField(max_digits=10, decimal_places=2)
    cost = models.DecimalField(max_digits=10, decimal_places=2)
    sales_price = models.DecimalField(max_digits=10, decimal_places=2)
    product_category = models.CharField(max_length=100)
    company = models.CharField(max_length=100)

    def calculate_sales_price(self):
        cost_float = float(self.cost)
        # Convert customer_tax to float before performing multiplication
        customer_tax_float = float(self.customer_tax)

        # Calculate sales price based on cost and customer tax
        sales_price = cost_float + (cost_float * customer_tax_float)

        return round(sales_price, 2)
    def save(self, *args, **kwargs) : 
        self.sales_price = self.calculate_sales_price()
        super().save(*args,**kwargs)



class Customer(models.Model):
    name = models.CharField(max_length=255)
    address = models.TextField()
    city = models.CharField(max_length=255)
    state = models.CharField(max_length=255)
    zip_code = models.CharField(max_length=10)
    country = models.CharField(max_length=255)
    photo = models.ImageField(upload_to='customer_photos/', blank=True, null=True)


class Contact(models.Model):
    customer_id = models.ForeignKey(Customer, on_delete=models.CASCADE)
    email = models.EmailField()
    mobile = models.CharField(max_length=255)
    

    def _str_(self):
        return self.name


class SaleOrder(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    invoice_address = models.TextField()
    delivery_address = models.TextField()
    expiration_date = models.DateField()
    payment_terms = models.CharField(max_length=50)
    products = models.ManyToManyField(Products, through='OrderProduct', related_name='sale_orders')
    total_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

class OrderProduct(models.Model):
    sale_order = models.ForeignKey(SaleOrder, on_delete=models.CASCADE, related_name='order_products', blank=True, null=True)
    product = models.ForeignKey(Products, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    additional_taxes = models.DecimalField(max_digits=5, decimal_places=2)
    discount = models.DecimalField(max_digits=10, decimal_places=2)
    subtotal_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)

