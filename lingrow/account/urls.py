from django.urls import path
from account.views import UserRegistrationView, UserLoginView, UserProfileView, UserChangePasswordView,\
     SendPasswordResetEmailView,UserPaswordResetView,AdminUserIDListView, AdminUserListView, ChildView, ChildAdminView, \
          GetUserView, AdminAddUsersView
urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='register'),
    path('login/', UserLoginView.as_view(), name='login'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('changepassword/', UserChangePasswordView.as_view(), name='changepassword'),
    path('send-reset-password-email/', SendPasswordResetEmailView.as_view(), name='send-reset-password-email'),
    path('reset-password/<uid>/<token>/', UserPaswordResetView.as_view(), name='reset-password'),
    path('admin-add-users/', AdminAddUsersView.as_view(), name='admin-add-users'),
    path('profile/<int:id>/', AdminUserIDListView.as_view(), name='admin-user-list'),
    path('profile/<str:user_cat>/', AdminUserListView.as_view(), name='admin-user-list'),
    path('child/',ChildView.as_view(), name='child'),
    path('child/<int:id>/',ChildView.as_view(), name='child'),
    path('parent/<int:pid>/child/<int:cid>/',ChildAdminView.as_view(), name='child'),
    path('parent/<int:pid>/child/',ChildAdminView.as_view(), name='child'),
    path('get-user/<int:id>/', GetUserView.as_view(), name='get-user')
    ]   
