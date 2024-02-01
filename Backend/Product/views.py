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




class ProductListCreateView(generics.ListCreateAPIView):
    queryset = Products.objects.all()
    serializer_class = ProductSerializer

class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Products.objects.all()
    serializer_class= ProductSerializer








@api_view(['POST'])
def create_customer(request):
    if request.method == 'POST':
        serializer = CustomerSerializer(data=request.data)
        if serializer.is_valid():
            # Save customer data
            customer = serializer.save()

            # Extract email and mobile
            email = request.data.get('email')
            mobile = request.data.get('mobile')

            # Save contact data
            contact_data = {'customer_id': customer.id, 'email': email, 'mobile': mobile}
            contact_serializer = ContactSerializer(data=contact_data)
            if contact_serializer.is_valid():
                contact_serializer.save()
                return Response({'message': 'Customer created successfully'}, status=201)
            else:
                customer.delete()  # Delete customer if contact creation fails
                return Response({'error': 'Failed to create contact'}, status=400)
        else:
            return Response(serializer.errors, status=400)
    else:
        return Response({'error': 'Method not allowed'}, status=405)


@api_view(['GET'])
def list_customers(request):
    customers = Customer.objects.all()
    serialized_customers = []
    for customer in customers:
        customer_data = CustomerSerializer(customer).data
        try:
            contact = Contact.objects.get(customer_id=customer.id)
            contact_data = {
                'email': contact.email,
                'mobile': contact.mobile
            }
            customer_data['contact'] = contact_data
        except Contact.DoesNotExist:
            pass
        serialized_customers.append(customer_data)
    return Response(serialized_customers)


@api_view(['GET'])
def retrieve_customer(request,pk):
    try:
        customer=Customer.objects.get(pk=pk)
    except Customer.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    serializer=CustomerSerializer(customer)
    return Response(serializer.data)

@api_view(['PUT', 'PATCH'])
def update_customer(request, pk):
    try:
        customer = Customer.objects.get(pk=pk)
    except Customer.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    serializer = CustomerSerializer(customer, data=request.data, partial=True)
    if serializer.is_valid():
        # Handle photo separately
        if 'photo' in request.FILES:
            customer.photo = request.FILES['photo']
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def create_contact(request):
    serializer= ContactSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data,status=status.HTTP_201_CREATED)
    return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)



@api_view(['GET'])
def list_contacts(request):
    contacts=Contact.objects.all()
    serializer=ContactSerializer(contacts,many=True)
    return Response(serializer.data)


@api_view(['GET'])
def retrieve_contact(request,pk):
    try:
        contact=Contact.objects.get(pk=pk)
    except Contact.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    serializer=ContactSerializer(contact)
    return Response(serializer.data)


@api_view(['GET'])
def customer_contact(request, customer_id):
    try:
        contacts = Contact.objects.filter(customer_id=customer_id)
        serializer = ContactSerializer(contacts, many=True)
        return Response(serializer.data)
    except Contact.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    

@api_view(['PUT'])
def update_customer_contact(request, customer_id):
    try:
        # Get the existing contact details for the specified customer
        contacts = Contact.objects.filter(customer_id=customer_id)
        
        if not contacts.exists():
            return Response({'error': 'No contact details found for the specified customer'}, status=status.HTTP_404_NOT_FOUND)
        
        # Assuming a customer has only one associated contact, update the first one found
        contact = contacts.first()
        
        # Update the contact details with the data from the request
        serializer = ContactSerializer(contact, data=request.data)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Contact.DoesNotExist:
        return Response({'error': 'No contact details found for the specified customer'}, status=status.HTTP_404_NOT_FOUND)
    

class SaleOrderListCreateView(generics.ListCreateAPIView):
    queryset = SaleOrder.objects.all()
    serializer_class = SaleOrderSerializer

    def perform_create(self, serializer):
        customer_id = self.request.data.get('customer')
        product_ids = self.request.data.get('products', [])

        try:
            customer = Customer.objects.get(id=customer_id)
        except Customer.DoesNotExist:
            return Response({'error': 'Customer not found.'}, status=status.HTTP_400_BAD_REQUEST)

        products = Products.objects.filter(id__in=product_ids)

        sale_order = serializer.save(customer=customer)
        sale_order.products.set(products)

        # Serialize the created SaleOrder instance
        serialized_sale_order = SaleOrderSerializer(sale_order).data

        # Include the serialized data in the response
        return Response(serialized_sale_order, status=status.HTTP_201_CREATED)

    


class SaleOrderDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = SaleOrder.objects.all()
    serializer_class = SaleOrderSerializer
    def perform_destroy(self, instance):
        # Delete associated SaleOrderItem instances
        instance.saleorderitem_set.all().delete()

        # Call the parent class's perform_destroy to delete the SaleOrder instance
        super().perform_destroy(instance)

class SaleOrderItemListAllView(generics.ListAPIView):
    queryset = SaleOrderItem.objects.all()
    serializer_class = SaleOrderItemSerializer

class SaleOrderItemCreateView(generics.CreateAPIView):
    serializer_class = SaleOrderItemSerializer

    def create(self, request, *args, **kwargs):
        sale_order_id = kwargs.get('pk')
        try:
            sale_order = SaleOrder.objects.get(pk=sale_order_id)
        except SaleOrder.DoesNotExist:
            return Response({"error": "Sale Order not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Extract the product and quantity from the validated data
        product = serializer.validated_data.get('product')
        quantity = serializer.validated_data.get('quantity')
        discount = serializer.validated_data.get('discount')

        # Calculate unit_price, taxes, and total based on the associated product
        unit_price = product.sales_price
        taxes = product.customer_tax
        total = (unit_price * quantity) - discount + (unit_price * quantity * taxes)

        # Save the SaleOrderItem instance
        sale_order_item = SaleOrderItem.objects.create(
            sale_order=sale_order,
            product=product,
            quantity=quantity,
            unit_price=unit_price,
            taxes=taxes,
            discount=discount,
            total=total
        )

        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
class SaleOrderItemListAPIView(generics.ListAPIView):
    serializer_class = SaleOrderItemSerializer

    def get_queryset(self):
        # Get the sale_order_id from the URL parameter
        sale_order_id = self.kwargs.get('sale_order_id')
        
        # Retrieve the SaleOrder instance
        try:
            sale_order = SaleOrder.objects.get(pk=sale_order_id)
        except SaleOrder.DoesNotExist:
            return SaleOrderItem.objects.none()

        # Return the SaleOrderItem instances related to the SaleOrder
        return SaleOrderItem.objects.filter(sale_order=sale_order)
    
class SaleOrderItemDeleteView(generics.DestroyAPIView):
    queryset = SaleOrderItem.objects.all()
    serializer_class = SaleOrderItemSerializer

class SaleOrderTotalAmountView(generics.RetrieveAPIView):
    serializer_class = SaleOrderSerializer

    def get_object(self):
        sale_order_id = self.kwargs.get('pk')
        try:
            return SaleOrder.objects.get(pk=sale_order_id)
        except SaleOrder.DoesNotExist:
            raise Http404("Sale Order not found")

    def retrieve(self, request, *args, **kwargs):
        sale_order = self.get_object()
        total_amount = sale_order.saleorderitem_set.aggregate(total_amount=models.Sum('total'))['total_amount'] or 0
        return Response({"total_amount": total_amount})

