import { Router } from '@vaadin/router';
import './app.js';


const routes = [
  {
    path: '/',
    component: 'lit-app',
    children: [
      {
        path: '',
        component: 'employee-list',
        action: async () => {
          await import('./pages/employee-list.js');
        }
      },   
      {
        path: 'form',
        component: 'employee-form',
        action: async () => {
          await import('./pages/employee-form.js');
        }

      },
      {
        path: 'form/:id',
        component: 'employee-form',
        action: async () => {
          await import('./pages/employee-form.js');
        }

      },    
    ],

  },
  {
    path: '(.*)',
    component: 'not-found',
    action: async () => {
      await import('./pages/not-found.js');
    }
  }

];


const outlet = document.getElementById('outlet');
export const router = new Router(outlet);
router.setRoutes(routes);