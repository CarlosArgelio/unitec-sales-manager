from rest_framework.routers import DefaultRouter

from .views import UserListViewSet, UserViewSet

router = DefaultRouter()
router.register(r"", UserViewSet, basename="user")
router.register(r"", UserListViewSet, basename="user_find_all")
urlpatterns = router.urls
