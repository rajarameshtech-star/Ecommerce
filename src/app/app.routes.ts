import { Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { AppComponent } from './app.component';
import { RegistrationComponent } from './registration/registration.component';
import { LoginComponent } from './login/login.component';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductViewComponent } from './product-view/product-view.component';
import { CartComponent } from './cart/cart.component';
import { OrdersComponent } from './orders/orders.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    {
        path:"",
        component:ProductListComponent,
        pathMatch:'full'
    },
    {
        path:"register",
        component:RegistrationComponent,
        pathMatch:'full'
    },
    {
        path:"login",
        component:LoginComponent,
        pathMatch:'full'
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
        canActivate : [authGuard]
    },
    {
        path: "previous-orders",
        component: OrdersComponent,
        canActivate : [authGuard]
    }
];
