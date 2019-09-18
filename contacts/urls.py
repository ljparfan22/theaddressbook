from rest_framework import routers
from .api import ContactViewSet
from django.conf import settings
from django.conf.urls.static import static

router = routers.DefaultRouter()
router.register('', ContactViewSet, 'contacts')

urlpatterns = router.urls
