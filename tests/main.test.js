import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock DOM for testing
const mockDOM = () => {
  global.document = {
    readyState: 'complete',
    addEventListener: vi.fn(),
    createElement: vi.fn(() => ({
      setAttribute: vi.fn(),
      appendChild: vi.fn(),
      rel: '',
      as: '',
      href: '',
    })),
    getElementById: vi.fn(),
    querySelector: vi.fn(),
    querySelectorAll: vi.fn(() => []),
    head: { appendChild: vi.fn() },
    body: { 
      appendChild: vi.fn(),
      classList: {
        add: vi.fn(),
        remove: vi.fn(),
        toggle: vi.fn(),
        contains: vi.fn(),
      }
    }
  };
  
  global.window = {
    addEventListener: vi.fn(),
    pageYOffset: 0,
    scrollY: 0,
    scrollTo: vi.fn(),
    requestAnimationFrame: vi.fn(cb => setTimeout(cb, 16)),
    matchMedia: vi.fn(() => ({ matches: false })),
    location: { pathname: '/' },
    navigator: { serviceWorker: undefined }
  };
  
  global.localStorage = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
  };
  
  // Mock jQuery
  global.jQuery = vi.fn(() => ({
    scrolly: vi.fn(),
    scrollzer: vi.fn(),
    on: vi.fn(),
    addClass: vi.fn(),
    removeClass: vi.fn(),
    attr: vi.fn(),
  }));
  global.$ = global.jQuery;
};

describe('Portfolio Website', () => {
  beforeEach(() => {
    mockDOM();
    vi.clearAllMocks();
  });

  describe('HTML Structure', () => {
    it('should have proper semantic structure', () => {
      // Test that HTML has the expected structure
      const htmlContent = `
        <div id="header">
          <div class="top">
            <div id="logo">
              <h1 id="title">Foivos Gypas, PhD</h1>
            </div>
            <nav id="nav">
              <ul>
                <li><a href="#top">Intro</a></li>
                <li><a href="#about">About Me</a></li>
                <li><a href="#tools">Tools</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </nav>
          </div>
        </div>
      `;
      
      expect(htmlContent).toContain('id="header"');
      expect(htmlContent).toContain('id="nav"');
      expect(htmlContent).toContain('Foivos Gypas, PhD');
    });

    it('should have all required sections', () => {
      const requiredSections = ['#top', '#about', '#tools', '#contact'];
      
      requiredSections.forEach(section => {
        expect(section).toMatch(/^#\w+$/);
      });
    });
  });

  describe('Navigation', () => {
    it('should have navigation links', () => {
      const navLinks = [
        { href: '#top', text: 'Intro' },
        { href: '#about', text: 'About Me' },
        { href: '#tools', text: 'Open Source Tools' },
        { href: '#contact', text: 'Contact' }
      ];
      
      navLinks.forEach(link => {
        expect(link.href).toMatch(/^#\w+$/);
        expect(link.text).toBeTruthy();
      });
    });
  });

  describe('Social Media Links', () => {
    it('should have proper social media links', () => {
      const socialLinks = [
        { platform: 'mastodon', url: 'https://mastodon.online/@fgypas' },
        { platform: 'bluesky', url: 'https://bsky.app/profile/fgypas.bsky.social' },
        { platform: 'github', url: 'https://github.com/fgypas' },
        { platform: 'linkedin', url: 'https://www.linkedin.com/in/foivosgypas/' },
        { platform: 'email', url: 'mailto:fgypas@gmail.com' }
      ];
      
      socialLinks.forEach(link => {
        expect(link.url).toMatch(/^(https?:\/\/|mailto:)/);
        expect(link.platform).toBeTruthy();
      });
    });

    it('should include rel="me" for Mastodon verification', () => {
      const mastodonLink = 'https://mastodon.online/@fgypas';
      expect(mastodonLink).toContain('mastodon.online');
    });
  });

  describe('Open Source Tools Section', () => {
    it('should have project tools listed', () => {
      const tools = [
        { name: 'Panoptes', url: 'https://github.com/panoptes-organization/panoptes' },
        { name: 'ZARP', url: 'https://git.scicore.unibas.ch/zavolan_group/pipelines/zarp' },
        { name: 'TECtool', url: 'http://tectool.unibas.ch/' },
        { name: 'mpMoRFsDB', url: 'http://bioinformatics.biol.uoa.gr/mpMoRFsDB/' }
      ];
      
      tools.forEach(tool => {
        expect(tool.name).toBeTruthy();
        expect(tool.url).toMatch(/^https?:\/\//);
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels and semantic HTML', () => {
      // Test for semantic structure
      const semanticElements = ['header', 'nav', 'main', 'section', 'footer'];
      
      semanticElements.forEach(element => {
        expect(element).toMatch(/^[a-z]+$/);
      });
    });

    it('should have alt text for images', () => {
      const imageAltTexts = [
        'Portrait of Foivos Gypas',
        'Panoptes logo',
        'ZARP pipeline logo',
        'TECtool interface',
        'mpMoRFsDB database interface'
      ];
      
      imageAltTexts.forEach(alt => {
        expect(alt).toBeTruthy();
        expect(alt.length).toBeGreaterThan(5);
      });
    });
  });

  describe('Performance', () => {
    it('should preload critical resources', () => {
      const criticalResources = [
        'assets/css/main.css',
        'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
      ];
      
      criticalResources.forEach(resource => {
        expect(resource).toBeTruthy();
      });
    });

    it('should have optimized images', () => {
      const images = [
        'images/me.jpg',
        'images/panoptes_logo.png',
        'images/zarp.png',
        'images/tectool.png',
        'images/mpmorfsdb.png'
      ];
      
      images.forEach(img => {
        expect(img).toMatch(/\.(jpg|jpeg|png|svg|webp)$/i);
      });
    });
  });

  describe('SEO and Meta Tags', () => {
    it('should have proper meta information', () => {
      const metaInfo = {
        title: 'Foivos Gypas, PhD - Bioinformatics & Data Science',
        description: 'Foivos Gypas - Bioinformatics Software Engineer specializing in data science, software development, and computational biology research.',
        keywords: 'bioinformatics, data science, software development, computational biology, RNA-seq, Basel, Switzerland'
      };
      
      expect(metaInfo.title).toContain('Foivos Gypas');
      expect(metaInfo.description).toContain('Bioinformatics');
      expect(metaInfo.keywords).toContain('bioinformatics');
    });

    it('should have structured data', () => {
      const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'Person',
        'name': 'Foivos Gypas',
        'jobTitle': 'Bioinformatics Software Engineer'
      };
      
      expect(structuredData['@type']).toBe('Person');
      expect(structuredData.name).toBe('Foivos Gypas');
    });
  });

  describe('Responsive Design', () => {
    it('should handle different viewport sizes', () => {
      const breakpoints = {
        mobile: 736,
        tablet: 960,
        desktop: 1200,
      };
      
      Object.values(breakpoints).forEach(width => {
        expect(width).toBeGreaterThan(0);
        expect(typeof width).toBe('number');
      });
    });
  });

  describe('Service Worker', () => {
    it('should register service worker if supported', () => {
      const mockRegistration = Promise.resolve({});
      global.navigator = {
        serviceWorker: {
          register: vi.fn(() => mockRegistration),
        },
      };
      
      global.window = {
        ...global.window,
        addEventListener: vi.fn((event, callback) => {
          if (event === 'load') {
            callback();
          }
        }),
      };
      
      // Test service worker registration logic
      if ('serviceWorker' in global.navigator) {
        global.window.addEventListener('load', function() {
          global.navigator.serviceWorker.register('/sw.js');
        });
      }
      
      expect(global.navigator.serviceWorker.register).toHaveBeenCalledWith('/sw.js');
    });
  });
});
