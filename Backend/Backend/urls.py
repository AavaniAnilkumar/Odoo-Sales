"""Backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path,include
from Product.views import *
from django.conf import settings
from django.conf.urls.static import static
# import Product.urls
urlpatterns = [
    path('admin/', admin.site.urls),
   

   path('odoo-integration/',odoo_integration),
   path('odoo-customers/', OdooCustomerView.as_view(), name='odoo_customers'),
   path('view-customers/',CustomerAPIView.as_view(),name='view customer'),
   path('odoo-products/',OdooProductView.as_view(), name='odoo-products'),
   path('view-products/',ProductAPIView.as_view(),name='view-products'),
   path('saleorders/', SaleOrderListCreateView.as_view(), name='saleorder-list-create'),
   path('orderproducts/', OrderProductListCreateView.as_view(), name='orderproduct-list-create'),
   path('orderproducts/delete/', OrderProductDeleteView.as_view(), name='order-product-delete'),
   
]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)