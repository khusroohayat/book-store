import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent {
  features = [
    {
      icon: 'user-check',
      title: 'User Authentication',
      description: 'Secure single-user system with personalized access control and data protection.',
      color: 'primary'
    },
    {
      icon: 'search',
      title: 'Advanced Search & Filtering',
      description: 'Find books instantly with powerful search capabilities and smart filtering options.',
      color: 'success'
    },
    {
      icon: 'image',
      title: 'Book Cover Upload',
      description: 'Upload and manage book cover images to create a visually appealing library.',
      color: 'info'
    },
    {
      icon: 'shopping-cart',
      title: 'E-commerce Integration',
      description: 'Built-in shopping cart, pricing management, and order processing capabilities.',
      color: 'warning'
    },
    {
      icon: 'star',
      title: 'Review & Rating System',
      description: 'Comprehensive user review system with detailed ratings and feedback management.',
      color: 'purple'
    },
    {
      icon: 'globe',
      title: 'Multi-language Support',
      description: 'Full internationalization support for global accessibility and usability.',
      color: 'teal'
    }
  ];

  stats = [
    { number: '10,000+', label: 'Books Managed', icon: 'book' },
    { number: '99.9%', label: 'Uptime', icon: 'shield' },
    { number: '24/7', label: 'Support', icon: 'headphones' },
    { number: '5★', label: 'User Rating', icon: 'star' }
  ];

  testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Independent Bookstore Owner',
      content: 'BookStore Pro transformed how I manage my inventory. The intuitive interface and powerful features saved me hours every week.',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    {
      name: 'Michael Chen',
      role: 'Library Manager',
      content: 'The search and filtering capabilities are incredible. Finding specific books in our collection has never been easier.',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    {
      name: 'Emma Rodriguez',
      role: 'Book Collector',
      content: 'I love the visual book covers and rating system. It makes managing my personal collection both functional and enjoyable.',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    }
  ];

  scrollToFeatures() {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  }

  getIconSvg(iconName: string): string {
    const icons: { [key: string]: string } = {
      'user-check': '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><polyline points="16,11 18,13 22,9"></polyline>',
      'search': '<circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.35-4.35"></path>',
      'image': '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="9" cy="9" r="2"></circle><polyline points="21,15 16,10 5,21"></polyline>',
      'shopping-cart': '<circle cx="8" cy="21" r="1"></circle><circle cx="19" cy="21" r="1"></circle><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>',
      'star': '<polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"></polygon>',
      'globe': '<circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>',
      'book': '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>',
      'shield': '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>',
      'headphones': '<path d="M3 18v-6a9 9 0 0 1 18 0v6"></path><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>'
    };
    return icons[iconName] || '';
  }
}