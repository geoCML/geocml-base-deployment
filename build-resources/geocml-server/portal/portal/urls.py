from django.contrib import admin
from django.urls import path
from portal.views import index, webmap
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', index, name="index"),
    path('webmap/', webmap, name="webmap")
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT) 
