import xmlrpc.client

url = 'https://apitrial.odoo.com' 
db = 'fahadrm-eastwestqtr-apitrial-11656765' 
username = 'admin'  
password = 'loyal123'  

common = xmlrpc.client.ServerProxy('{}/xmlrpc/2/common'.format(url))
print(common.version())

uid = common.authenticate(db, username, password, {})
print(f"User ID: {uid}")

models = xmlrpc.client.ServerProxy('{}/xmlrpc/2/object'.format(url))
result = models.execute_kw(db, uid, password, 'res.partner', 'check_access_rights', ['read'], {'raise_exception': False})
print(result)


uid = 2  # User ID of the user whose access rights have been configured
search_domain = [[['is_company', '=', True]]]

# Create an XML-RPC server proxy
models = xmlrpc.client.ServerProxy('{}/xmlrpc/2/object'.format(url))

try:
    # Perform the search operation on the 'res.partner' model
    partner_ids = models.execute_kw(db, uid, password, 'res.partner', 'search', search_domain)

    # Print the result or perform further actions
    print("Company Partner IDs:", partner_ids)

except xmlrpc.client.Fault as e:
    # Handle any faults or errors
    print(f"Error: {e.faultCode} - {e.faultString}")
