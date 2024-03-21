from django.db import models


class Customer(models.Model):
    name=models.CharField(max_length=255)
    street=models.CharField(max_length=255)
    # street2=models.CharField(max_length=255)
    city=models.CharField(max_length=255)
    # state_id=models.IntegerField()
    zip=models.CharField(max_length=255)
    # country_id=models.IntegerField()
    image=models.ImageField(upload_to='customer_photos/',null=True,blank=True)
    email=models.EmailField()
    mobile_no=models.CharField(max_length=20)
    gst_treatment = models.CharField(max_length=255, blank=True, null=True)
    state_name = models.CharField(max_length=255)
    country_name = models.CharField(max_length=255) 


class Product(models.Model):
    name = models.CharField(max_length=255)
    sales_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    customer_tax_name = models.CharField(max_length=100)
    image = models.ImageField(upload_to='product_images/', null=True, blank=True)
    # total_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    total_price = models.CharField(max_length=255)

    def __str__(self):
        return self.name

class SaleOrder(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    invoice_address = models.TextField()
    delivery_address = models.TextField()
    expiration_date = models.DateField()
    payment_terms = models.CharField(max_length=50)
    products = models.ManyToManyField(Product, through='OrderProduct', related_name='sale_orders')
    total_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

class OrderProduct(models.Model):
    sale_order = models.ForeignKey(SaleOrder, on_delete=models.CASCADE, related_name='order_products', blank=True, null=True)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField()
    additional_taxes = models.DecimalField(max_digits=5, decimal_places=2)
    discount = models.DecimalField(max_digits=10, decimal_places=2)
    subtotal_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)

    