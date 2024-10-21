import { Routes } from '@angular/router';
import { CameraComponent } from './camera/camera.component';
import { AppComponent } from './app.component';

export const routes: Routes = [
    {
        path: '',
        component: AppComponent,
        children: [
            {
                path:'camera',
                component: CameraComponent
            },
        ]
    }
];
