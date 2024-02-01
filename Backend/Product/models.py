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
    products = models.ManyToManyField(Products)
    invoice_address = models.TextField()
    delivery_address = models.TextField()
    expiration_date = models.DateField()
    payment_terms = models.CharField(max_length=50)
    # custom_id = models.CharField(max_length=10, unique=True, editable=False)
    custom_id  = models.CharField(max_length=100,unique=True,editable=False)


    def save(self, *args, **kwargs):
        # Generate a custom ID like "SO001"
        if not self.custom_id:
            last_id = SaleOrder.objects.all().order_by('-id').first()
            if last_id:
                last_id = int(last_id.custom_id[2:])
                new_id = f"SO{str(last_id + 1).zfill(3)}"
            else:
                new_id = "SO001"
            self.custom_id = new_id

        super().save(*args, **kwargs)

class SaleOrderItem(models.Model):
    sale_order = models.ForeignKey(SaleOrder, on_delete=models.CASCADE)
    product = models.ForeignKey(Products, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    taxes = models.DecimalField(max_digits=5, decimal_places=2)
    discount = models.DecimalField(max_digits=10, decimal_places=2)
    total = models.DecimalField(max_digits=10, decimal_places=2)

    def save(self, *args, **kwargs):
        # Set unit_price and taxes from the associated product
        self.unit_price = self.product.sales_price
        self.taxes = self.product.customer_tax  # Use the correct attribute (customer_tax) from Products model
        self.total = (self.unit_price * self.quantity) - self.discount + (self.unit_price * self.quantity * self.taxes)

        super(SaleOrderItem, self).save(*args, **kwargs)
