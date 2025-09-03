import { Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { AppComponent } from './app.component';
import { RegistrationComponent } from './registration/registration.component';
import { LoginComponent } from './login/login.component';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductViewComponent } from './product-view/product-view.component';
import { CartComponent } from './cart/cart.component';
import { OrdersComponent } from './orders/orders.component';
import { authGuard, noAuthGuard, timeoutGuard } from './guards/auth.guard';
import { sellerGuard, userGuard } from './guards/role-guard.guard';
import { registerAppScopedDispatcher } from '@angular/core/primitives/event-dispatch';
import { SellerDashboardComponent } from './seller/seller-dashboard/seller-dashboard.component';
import { SellerProductsComponent } from './seller/seller-products/seller-products.component';
import { SellerOrdersComponent } from './seller/seller-orders/seller-orders.component';

export const routes: Routes = [
    {
        path:"",
        component:ProductListComponent,
        pathMatch:'full',
        canActivate : [noAuthGuard]
    },
    {
        path:"register",
        component:RegistrationComponent,
        pathMatch:'full',
        canActivate : [noAuthGuard]
    },
    {
        path:"login",
        component:LoginComponent,
        pathMatch:'full',
        canActivate : [noAuthGuard]
    },
    {
        path:"products",
        component:ProductListComponent,
        pathMatch:"full"
    },
    {
        path:"products/:id",
        component:ProductViewComponent
    },
    {
        path: "cart",
        component:CartComponent,
        canActivate : [authGuard, userGuard],
    },
    {
        path: "previous-orders",
        component: OrdersComponent,
        canActivate : [authGuard, userGuard]
    },
     {
        path: "seller",
        component: SellerDashboardComponent , // Change to SellerDashboardComponent when created
        canActivate : [authGuard, sellerGuard, timeoutGuard],
        children : [
            {
                path : "products",
                component : SellerProductsComponent,
                canActivate : [timeoutGuard]
            },
            {
                path : "orders",
                component : SellerOrdersComponent,
                canActivate : [timeoutGuard]
            }
        ]
     }
];
