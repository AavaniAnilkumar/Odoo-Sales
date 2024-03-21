from django.shortcuts import render
from .serializers import *
from .models import *
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework import generics
from django.shortcuts import get_object_or_404

from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from django.http import Http404


import xmlrpc.client
from django.http import JsonResponse




class ProductListCreateView(generics.ListCreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    serializer_class= ProductSerializer



class CustomerListCreateView(generics.ListCreateAPIView):
    queryset=Customer.objects.all()
    serializer_class=CustomerSerializer
   
class CustomerDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset=Customer.objects.all()
    serializer_class=CustomerSerializer
  



from django.views import View
import xmlrpc.client
from django.http import JsonResponse
from django.views import View
from django.core.files.base import ContentFile
import base64
from .models import Customer,Product
import base64
from django.core.files.base import ContentFile
from decimal import Decimal
from django.core.serializers.json import DjangoJSONEncoder

def odoo_integration():
    url='https://apitrial.odoo.com/'
    db='fahadrm-eastwestqtr-apitrial-11656765'
    username='admin'
    password='loyal123'
    common = xmlrpc.client.ServerProxy(url + 'xmlrpc/2/common')
    uid = common.authenticate(db,username,password,{})
    models = xmlrpc.client.ServerProxy(url + 'xmlrpc/2/object')
    return models,db,uid,password

class OdooCustomerView(View):

    def get(self, request, *args, **kwargs):
       try:
            models,db,uid,password=odoo_integration()

            customer_search_criteria = [['is_company', '=', False]]
            customer_fields = [
                'name',
                'street',
                'city',
                'state_id',
                'zip',
                'country_id',
                'image_1920',
                'email',
                'mobile',
                'function',
                'title',
                'l10n_in_gst_treatment'
            ]

            customer_data = models.execute_kw(
                db, uid, password, 'res.partner', 'search_read',
                [customer_search_criteria],
                {'fields': customer_fields, 'limit': 5}
            )
            
            gst_treatment_reverse_mapping = {
                'regular': 'Registered Business - Regular',
                'composition': 'Registered Business-Composition',
                'unregistered': 'Unregistered Business',
                'consumer': 'Consumer',
                'overseas': 'Overseas',
                'sez': 'Special Economic Zone',
                'deemed_export': 'Deemed Export',
                'uin_holders': 'UIN Holders'
            }
            
            for customer_entry in customer_data:
                image_data = customer_entry.get('image_1920')
                if image_data:
                    image_data = base64.b64decode(image_data)
                    gst_treatment = customer_entry.get('l10n_in_gst_treatment')
                    if gst_treatment:
                        gst_treatment = gst_treatment_reverse_mapping.get(gst_treatment, gst_treatment)
                    
                    state_id = customer_entry.get('state_id')[0] if customer_entry.get('state_id') else 1
                    country_id = customer_entry.get('country_id')[0] if customer_entry.get('country_id') else 1
                    
                    state_name = models.execute_kw(
                        db, uid, password, 'res.country.state', 'search_read',
                        [[['id', '=', state_id]]],
                        {'fields': ['name']}
                    )[0].get('name') if state_id else None
                    
                    country_name = models.execute_kw(
                        db, uid, password, 'res.country', 'search_read',
                        [[['id', '=', country_id]]],
                        {'fields': ['name']}
                    )[0].get('name') if country_id else None
                    
                    customer, created = Customer.objects.update_or_create(
                        id=customer_entry.get('id'),
                        defaults={
                            'name': customer_entry.get('name'),
                            'street': customer_entry.get('street'),
                            'city': customer_entry.get('city'),
                            'state_id': state_id,
                            'state_name': state_name,
                            'zip': customer_entry.get('zip'),
                            'country_id': country_id,
                            'country_name': country_name,
                            'email': customer_entry.get('email'),
                            'mobile_no': customer_entry.get('mobile'),
                            'job_position': customer_entry.get('function'),
                            'title': customer_entry.get('title'),
                            'gst_treatment': gst_treatment,
                            
                            
                        }
                    )
                    customer.image.save(f'{customer.id}_image.jpg', ContentFile(image_data), save=True)
                    
            customer = Customer.objects.all().values('name', 'street', 'city', 'state_name', 'zip', 'country_name', 'image', 'gst_treatment')
            customer_data = list(customer)

            serialized_data = JsonResponse(customer_data, safe=False)
            return serialized_data
       except xmlrpc.client.Error as e:
           return JsonResponse({'error':str(e)},status=500)
       except Exception as e:
           return JsonResponse({'error':str(e)},status=500)

class CustomerAPIView(APIView):
    def get(self,request):
        customers = Customer.objects.all()
        serializers= CustomerSerializer(customers,many=True)
        return Response(serializers.data)


class OdooProductView(View):
    def map_product_type(self, detailed_type):
        if detailed_type == 'consu':
            return 'Consumable'
        elif detailed_type == 'service':
            return 'Service'

    def map_invoicing_policy(self, invoice_policy):
        if invoice_policy == 'order':
            return 'Ordered Quantities'
        elif invoice_policy == 'delivery':
            return 'Delivered Quantities'

    def get_tax_details(self, models, db, uid, password, tax_id):
        tax_fields = ['id', 'name'] 
        tax_data = models.execute_kw(
            db, uid, password, 'account.tax', 'read',
            [[tax_id]],
            {'fields': tax_fields}
        )
        if tax_data:
            return tax_data[0]
        return None

    def get(self, request, *args, **kwargs):
        try:
            models, db, uid, password = odoo_integration()
            product_search_criteria = []  
            product_fields = [
                'id',  
                'name',
                'detailed_type',
                'invoice_policy',
                'list_price',
                'taxes_id',  
                'image_1920',
                'sale_ok',
                'purchase_ok',
                'categ_id',
                'standard_price',
                'tax_string'
                
            ]

            product_data = models.execute_kw(
                db, uid, password, 'product.product', 'search_read',
                [product_search_criteria],
                {'fields': product_fields, 'limit': 5}
            )

            result_data = []

            for product_entry in product_data:
                image_data = product_entry.get('image_1920')
                if image_data:
                    image_data = base64.b64decode(image_data)

                sales_price = Decimal(product_entry.get('list_price'))

                tax_id = product_entry.get('taxes_id')
                if isinstance(tax_id,list):
                    tax_id=tax_id[0]

                tax_details = self.get_tax_details(models, db, uid, password, tax_id)
                total_price = product_entry.get('tax_string','')
                total_price = total_price.replace("(","").replace(")","").replace("=","").strip()
                # print("Tax Details",tax_details)

                product_data = {
                    'name': product_entry.get('name'),
                    'sales_price': str(sales_price),
                    # 'customer_tax_id': tax_id,
                    'customer_tax_name': tax_details.get('name') if tax_details else None,
                    'total_price':total_price,
                    'image': f'product_images/{product_entry.get("id")}_image.jpg',
                }
                result_data.append(product_data)

                image_name = f'{product_entry.get("id")}_image.jpg'
                # Update or create Product model
                Product.objects.update_or_create(
                    id=product_entry.get('id'),
                    defaults={
                        'name': product_entry.get('name'),
                        'product_type': self.map_product_type(product_entry.get('detailed_type')),
                        'invoicing_policy': self.map_invoicing_policy(product_entry.get('invoice_policy')),
                        'sales_price': sales_price,
                        'customer_tax_id': tax_id,
                        'customer_tax_name': tax_details.get('name') if tax_details else None,
                        'can_be_sold': product_entry.get('sale_ok'),
                        'can_be_purchased': product_entry.get('purchase_ok'),
                        'category': product_entry.get('categ_id')[1] if isinstance(product_entry.get('categ_id'), list) else product_entry.get('categ_id'),
                        'cost': product_entry.get('standard_price'),
                        'total_price':total_price
                    }
                )
                product = Product.objects.get(id=product_entry.get('id'))
                product.image.save(image_name, ContentFile(image_data), save=True)

            return JsonResponse(result_data, safe=False, encoder=DjangoJSONEncoder)
        except xmlrpc.client.Error as e:
            return JsonResponse({'error': str(e)}, status=500)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

class ProductAPIView(APIView):
    def get(self,request):
        products= Product.objects.all()
        serializers= ProductSerializer(products,many=True)
        return Response(serializers.data)

class SaleOrderListCreateView(generics.ListCreateAPIView):
    queryset = SaleOrder.objects.all()
    serializer_class = SaleOrderSerializer
    def get_serializer(self, *args, **kwargs):
        if isinstance(kwargs.get('data', {}), list):
            kwargs['many'] = True
        return super().get_serializer(*args, **kwargs)

class OrderProductListCreateView(generics.ListCreateAPIView):
    queryset = OrderProduct.objects.all()
    serializer_class = OrderProductSerializer

class OrderProductDeleteView(generics.GenericAPIView):
    queryset = OrderProduct.objects.filter(sale_order__isnull=True)
    serializer_class = OrderProductSerializer

    def delete(self, request, *args, **kwargs):
        # Delete all OrderProducts where sale_order is null
        self.queryset.delete()

        return Response({'message': ' OrderProducts deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)
