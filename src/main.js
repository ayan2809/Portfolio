// Theme Management
const themeToggle = document.getElementById('theme-toggle');
const root = document.documentElement;

// Check for saved theme preference or system preference
const getPreferredTheme = () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    return savedTheme;
  }
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
};

const setTheme = (theme) => {
  root.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
};

// Initialize theme
setTheme(getPreferredTheme());

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const currentTheme = root.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  });
}

// Mobile navigation toggle
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
    document.body.classList.toggle('menu-open');
  });

  // Close menu when clicking a link
  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      navToggle.classList.remove('active');
      document.body.classList.remove('menu-open');
    });
  });
}

// Intersection Observer for scroll animations
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, observerOptions);

// Add fade-in class to all sections and cards
document.querySelectorAll('.section, .highlight-card, .skill-category, .cert-card, .project-card, .achievement-item, .education-card, .contact-card').forEach(el => {
  el.classList.add('fade-in');
  observer.observe(el);
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// --- Optimized Scroll Listeners (Parallax & Active Nav) ---
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-menu a');
const hero = document.querySelector('.hero');
const heroContent = document.querySelector('.hero-content');

let isScrolling = false;

const onScroll = () => {
  const scrolled = window.pageYOffset;

  // Parallax Hero
  if (hero && heroContent && scrolled < window.innerHeight) {
    heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
    heroContent.style.opacity = 1 - (scrolled / window.innerHeight);
  }

  // Active Nav Link
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    const sectionHeight = section.offsetHeight;
    if (scrolled >= sectionTop && scrolled < sectionTop + sectionHeight) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.style.color = '';
    if (link.getAttribute('href') === `#${current}`) {
      link.style.color = 'var(--accent-primary)';
    }
  });

  isScrolling = false;
};

window.addEventListener('scroll', () => {
  if (!isScrolling) {
    isScrolling = true;
    requestAnimationFrame(onScroll);
  }
});

import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

// --- WebGL / Three.js Distributed Cluster Rendering ---
const initThreeJSAnimation = () => {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  try {
    const testCanvas = document.createElement('canvas');
    if (!window.WebGLRenderingContext || (!testCanvas.getContext('webgl') && !testCanvas.getContext('experimental-webgl'))) {
      console.warn('WebGL not supported');
      return;
    }
  } catch (e) { return; }

  const parent = canvas.parentElement;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Cap pixel ratio for perf
  renderer.setSize(parent.offsetWidth, parent.offsetHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, parent.offsetWidth / parent.offsetHeight, 0.1, 1000);
  camera.position.z = 150;

  // Render & Bloom Pass
  const renderScene = new RenderPass(scene, camera);
  const bloomPass = new UnrealBloomPass(new THREE.Vector2(parent.offsetWidth, parent.offsetHeight), 1.5, 0.4, 0.85);
  bloomPass.threshold = 0;
  bloomPass.strength = 1.2;
  bloomPass.radius = 0.5;

  const composer = new EffectComposer(renderer);
  composer.addPass(renderScene);
  composer.addPass(bloomPass);

  // Cluster Nodes Architecture
  const nodeCount = 80;
  const geometry = new THREE.SphereGeometry(1, 16, 16);
  const material = new THREE.MeshBasicMaterial({ color: 0x22d3ee });

  const nodes = [];
  const linesMaterial = new THREE.LineBasicMaterial({ color: 0x6366f1, transparent: true, opacity: 0.15 });

  for (let i = 0; i < nodeCount; i++) {
    const mesh = new THREE.Mesh(geometry, material.clone());
    mesh.position.x = (Math.random() - 0.5) * 300;
    mesh.position.y = (Math.random() - 0.5) * 300;
    mesh.position.z = (Math.random() - 0.5) * 150;

    // Assign mock data
    const services = ['Search-API', 'Auth-Service', 'Event-Router', 'DB-Shard-A', 'K8s-Master', 'Metrics-Agent'];
    mesh.userData = {
      id: `pod-${Math.floor(Math.random() * 10000)}`,
      service: services[Math.floor(Math.random() * services.length)],
      latency: Math.floor(Math.random() * 50) + 2,
      status: Math.random() > 0.95 ? 'Degraded' : 'Healthy',
      baseColor: 0x22d3ee
    };

    scene.add(mesh);
    nodes.push(mesh);
  }

  // Connections (Lines between nearby nodes)
  const lineGeometry = new THREE.BufferGeometry();
  const positions = new Float32Array(nodeCount * nodeCount * 3);
  lineGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const linesMesh = new THREE.LineSegments(lineGeometry, linesMaterial);
  scene.add(linesMesh);

  // Interaction (Raycasting)
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2(-10, -10);
  const tooltip = document.getElementById('node-tooltip');

  let hoveredNode = null;

  window.addEventListener('mousemove', (e) => {
    mouse.x = (e.clientX / parent.offsetWidth) * 2 - 1;
    mouse.y = -(e.clientY / parent.offsetHeight) * 2 + 1;

    if (tooltip && hoveredNode) {
      tooltip.style.left = `${e.clientX + 15}px`;
      tooltip.style.top = `${e.clientY + 15}px`;
    }
  });

  window.addEventListener('resize', () => {
    camera.aspect = parent.offsetWidth / parent.offsetHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(parent.offsetWidth, parent.offsetHeight);
    composer.setSize(parent.offsetWidth, parent.offsetHeight);
  });

  let isAnimating = true;

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      isAnimating = false;
    } else {
      isAnimating = true;
      animate();
    }
  });

  const animate = () => {
    if (!isAnimating) return;
    requestAnimationFrame(animate);

    scene.rotation.y += 0.001;
    scene.rotation.x += 0.0005;

    let vertexIndex = 0;
    const posAttribute = linesMesh.geometry.attributes.position;

    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        const dist = nodes[i].position.distanceTo(nodes[j].position);
        if (dist < 40) {
          posAttribute.setXYZ(vertexIndex++, nodes[i].position.x, nodes[i].position.y, nodes[i].position.z);
          posAttribute.setXYZ(vertexIndex++, nodes[j].position.x, nodes[j].position.y, nodes[j].position.z);
        }
      }
    }
    linesMesh.geometry.setDrawRange(0, vertexIndex);
    posAttribute.needsUpdate = true;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(nodes);

    if (intersects.length > 0) {
      if (hoveredNode !== intersects[0].object) {
        if (hoveredNode) {
          hoveredNode.scale.set(1, 1, 1);
          hoveredNode.material.color.setHex(hoveredNode.userData.baseColor);
        }
        hoveredNode = intersects[0].object;
        hoveredNode.scale.set(1.8, 1.8, 1.8);
        hoveredNode.material.color.setHex(0x6366f1); // Indigo active

        if (tooltip) {
          tooltip.style.opacity = 1;
          tooltip.innerHTML = `Pod: ${hoveredNode.userData.service}\nID: ${hoveredNode.userData.id}\nLatency: ${hoveredNode.userData.latency}ms\nStatus: ${hoveredNode.userData.status}`;
          tooltip.style.color = hoveredNode.userData.status === 'Degraded' ? '#ef4444' : '#10b981';

          // Keep it relative to where mouse is
          tooltip.style.left = `${mouse.x * (parent.offsetWidth / 2) + (parent.offsetWidth / 2) + 15}px`;
          tooltip.style.top = `${-(mouse.y * (parent.offsetHeight / 2)) + (parent.offsetHeight / 2) + 15}px`;
        }
      }
    } else if (hoveredNode) {
      hoveredNode.scale.set(1, 1, 1);
      hoveredNode.material.color.setHex(hoveredNode.userData.baseColor);
      hoveredNode = null;
      if (tooltip) {
        tooltip.style.opacity = 0;
      }
    }

    composer.render();
  };

  animate();
};

document.addEventListener('DOMContentLoaded', initThreeJSAnimation);

// --- GitHub Pinned Repositories Fetcher ---
const fetchGitHubRepos = async () => {
  const container = document.getElementById('github-repos');
  if (!container) return;

  const username = 'ayan2809';

  try {
    // Note: GitHub doesn't have an official REST endpoint for *pinned* repos specifically without GraphQL/Auth.
    // As a workaround for a vanilla frontend, we fetch public repos, sort by stars, and slice the top 3.
    // For a production app, a small serverless function to wrap the GraphQL API is better.
    const response = await fetch(`https://api.github.com/users/${username}/repos?sort=stargazers_count&per_page=10`);

    if (!response.ok) throw new Error('Failed to fetch repositories');

    const repos = await response.json();

    // Filter out forks and pick top 3
    const topRepos = repos
      .filter(repo => !repo.fork)
      .slice(0, 3);

    if (topRepos.length === 0) {
      container.innerHTML = '<div class="repo-error">No public repositories found.</div>';
      return;
    }

    const reposHTML = topRepos.map(repo => `
      <a href="${repo.html_url}" target="_blank" rel="noopener" class="repo-card">
        <div class="repo-header">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
          <span class="repo-title">${repo.name}</span>
        </div>
        <p class="repo-description">${repo.description || 'No description provided.'}</p>
        <div class="repo-meta">
          ${repo.language ? `<div class="repo-stat"><span style="color: var(--accent-secondary)">●</span> ${repo.language}</div>` : ''}
          <div class="repo-stat">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
            ${repo.stargazers_count}
          </div>
          <div class="repo-stat">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="18" r="3"></circle><circle cx="6" cy="6" r="3"></circle><circle cx="18" cy="9" r="3"></circle><path d="M18 12v-1.5a2.5 2.5 0 0 0-5 0v3a2.5 2.5 0 0 1-5 0V9"></path></svg>
            ${repo.forks_count}
          </div>
        </div>
      </a>
    `).join('');

    container.innerHTML = reposHTML;

  } catch (error) {
    console.error('Error fetching GitHub repos:', error);
    container.innerHTML = `
      <div class="repo-error">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
        <span>Unable to load repositories. Please check my <a href="https://github.com/${username}" target="_blank" style="color: var(--accent-primary)">GitHub profile</a>.</span>
      </div>
    `;
  }
};

document.addEventListener('DOMContentLoaded', fetchGitHubRepos);

// --- Contact Form Handling ---
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const statusDiv = document.getElementById('form-status');
    const submitBtn = contactForm.querySelector('.btn-submit');
    const originalBtnText = submitBtn.innerHTML;

    // UI Loading state
    submitBtn.innerHTML = '<svg class="icon-spin" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg> Sending...';
    submitBtn.disabled = true;

    // Simulate API call (This is where the AWS API Gateway URL would go)
    setTimeout(() => {
      contactForm.reset();
      submitBtn.innerHTML = originalBtnText;
      submitBtn.disabled = false;

      statusDiv.className = 'form-status success';
      statusDiv.textContent = 'Message sent successfully! I will get back to you soon.';

      setTimeout(() => {
        statusDiv.textContent = '';
        statusDiv.className = 'form-status';
      }, 5000);
    }, 1500);
  });
}

// --- Phase 2: Data Pipeline Scroll Flow ---
const initDataPipeline = () => {
  const container = document.getElementById('pipeline-container');
  const svg = document.getElementById('pipeline-svg');
  const path = document.getElementById('pipeline-path');
  const packets = [
    document.getElementById('pipeline-packet-1'),
    document.getElementById('pipeline-packet-2'),
    document.getElementById('pipeline-packet-3')
  ];

  if (!container || !svg || !path) return;

  const sectionsToTrack = ['experience', 'skills', 'projects']
    .map(id => document.getElementById(id))
    .filter(Boolean); // Only keep sections that actually exist

  if (sectionsToTrack.length === 0) return; // Exit if no sections to track

  let pathLength = 0;

  const drawPipeline = () => {
    const height = document.body.scrollHeight;
    const width = document.body.scrollWidth;

    container.style.height = `${height}px`;
    svg.setAttribute('width', width);
    svg.setAttribute('height', height);
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);

    const padding = window.innerWidth > 768 ? window.innerWidth * 0.1 : 20;

    let d = '';

    sectionsToTrack.forEach((sec, i) => {
      if (!sec) return;

      const rect = sec.getBoundingClientRect();
      const top = rect.top + window.scrollY;
      const bottom = top + rect.height;
      const centerY = top + rect.height / 2;

      const xOffset = i % 2 === 0 ? padding : width - padding;

      if (i === 0) {
        d += `M ${width / 2},0 `;
        d += `C ${width / 2},${top / 2} ${xOffset},${top / 2} ${xOffset},${top} `;
      } else {
        const prevSec = sectionsToTrack[i - 1];
        if (prevSec) {
          const prevRect = prevSec.getBoundingClientRect();
          const prevBottom = prevRect.bottom + window.scrollY;
          const prevXOffset = (i - 1) % 2 === 0 ? padding : width - padding;
          d += `C ${prevXOffset},${prevBottom + 100} ${xOffset},${top - 100} ${xOffset},${top} `;
        }
      }

      // Line down through section roughly aligned to the side
      d += `L ${xOffset},${bottom} `;

      if (i === sectionsToTrack.length - 1) {
        d += `C ${xOffset},${bottom + 100} ${width / 2},${bottom + 200} ${width / 2},${height}`;
      }
    });

    path.setAttribute('d', d);
    pathLength = path.getTotalLength();
    path.style.strokeDasharray = pathLength;
    path.style.strokeDashoffset = pathLength;
  };

  drawPipeline();
  window.addEventListener('resize', drawPipeline);

  let isPipelineScrolling = false;

  const onPipelineScroll = () => {
    if (!pathLength) return;
    const scrollPos = window.scrollY;

    // Add innerHeight so that path draws as the user scrolls down reading
    const maxScroll = Math.max(1, document.body.scrollHeight - window.innerHeight);
    const scrollPercent = Math.min(1, Math.max(0, scrollPos / maxScroll));

    const drawLength = pathLength * scrollPercent;
    path.style.strokeDashoffset = pathLength - drawLength;

    packets.forEach((packet, i) => {
      const packetPos = Math.max(0, drawLength - (i * 250)); // stagger the packets
      if (packetPos > 0 && drawLength > 10) {
        packet.style.opacity = 1;
        try {
          const point = path.getPointAtLength(packetPos);
          packet.setAttribute('cx', point.x);
          packet.setAttribute('cy', point.y);
        } catch (e) { }
      } else {
        packet.style.opacity = 0;
      }
    });
    isPipelineScrolling = false;
  };

  window.addEventListener('scroll', () => {
    if (!isPipelineScrolling) {
      isPipelineScrolling = true;
      requestAnimationFrame(onPipelineScroll);
    }
  });

  const observer = new IntersectionObserver((entries) => {
    let anyIntersecting = false;
    entries.forEach(entry => {
      if (entry.isIntersecting) anyIntersecting = true;
    });

    if (anyIntersecting) {
      path.style.opacity = 1;
      path.style.filter = 'drop-shadow(0 0 5px var(--accent-primary))';
    } else {
      path.style.opacity = 0.15;
      path.style.filter = 'none';
    }
  }, { threshold: 0.1 });

  sectionsToTrack.forEach(sec => sec && observer.observe(sec));
  setTimeout(onPipelineScroll, 100);
};

document.addEventListener('DOMContentLoaded', initDataPipeline);

// --- Phase 3: Quake-Style Dev Terminal ---
const initDevTerminal = () => {
  const terminal = document.getElementById('dev-terminal');
  const input = document.getElementById('terminal-input');
  const output = document.getElementById('terminal-output');
  const closeBtn = terminal.querySelector('.terminal-close');

  if (!terminal || !input || !output) return;

  let isOpen = false;
  let history = [];
  let historyIdx = -1;

  const toggleTerminal = () => {
    isOpen = !isOpen;
    if (isOpen) {
      terminal.classList.add('open');
      setTimeout(() => input.focus(), 300);
    } else {
      terminal.classList.remove('open');
      input.blur();
    }
  };

  const printLog = (text, className = '') => {
    const div = document.createElement('div');
    div.className = `terminal-log ${className}`;
    div.innerHTML = text; // allow basic HTML like spans
    output.appendChild(div);
    output.scrollTop = output.scrollHeight;
  };

  const clearTerminal = () => {
    output.innerHTML = '';
  };

  const PERSONAL_DATA = {
    biography: {
      short: "Ayan Sadhukhan - Backend Engineer. \"Clarity over cleverness.\"",
      long: "Ayan Sadhukhan\n\nI build resilient, scalable backend architectures.\nFrom squeezing milliseconds out of search APIs to orchestrating microservices in Kubernetes, I love the nitty-gritty of system design.\n\nBut I'm not just code. I believe in 'Clarity over cleverness'.\nI write, I read Stoic philosophy, and I run long distances to keep my mind sharp.\n\nLet's build something that lasts."
    },
    interests_teasers: [
      "Fact: I once ran a half-marathon with zero training because my friend bet me a coffee.",
      "Detail: My mechanical keyboard is louder than my thoughts.",
      "Fact: I apply database normalization rules to my grocery list.",
      "Detail: I unironically enjoy reading AWS whitepapers on Sunday mornings.",
      "Fact: I consider 'git rebase -i' a form of therapeutic meditation."
    ],
    quirks: {
      reveal: "Initializing trace...\nFetching encrypted payload...\nDecrypting...\n\n    .======================================.\n    |   _      _                           |\n    |  (_)    (_)    \"404: SLEEP NOT FOUND\"|\n    |    \\    /                            |\n    |     \\  /       Fueled by excessive   |\n    |   ___\\/___     caffeine and unhandled|\n    |  |        |    exceptions.           |\n    |  | COFFEE |                          |\n    |  |        |                          |\n    |  |________|                          |\n    '======================================'\n\nSecret unlocked: I will happily spend 6 hours automating a task that takes 5 minutes to do manually."
    }
  };

  const QUIRKY_ERRORS = [
    "Command not found. Have you tried turning it off and on again?",
    "404: Skill not found. I'm a backend engineer, not a magician.",
    "I'm sorry Dave, I'm afraid I can't do that.",
    "Error: Expected 'sudo make me a sandwich', got that garbage instead.",
    "Look, I just route data. I don't know what you want from me.",
    "An error occurred while displaying the previous error."
  ];

  const typeWriter = async (text, speed = 25) => {
    const div = document.createElement('div');
    div.className = 'terminal-log';
    div.style.whiteSpace = 'pre-wrap'; // Ensure formatting matches newlines exactly
    output.appendChild(div);

    input.disabled = true; // Prevent input from interrupting the animation

    let currentText = '';
    for (let i = 0; i < text.length; i++) {
      currentText += text[i];
      div.textContent = currentText;
      output.scrollTop = output.scrollHeight;
      await new Promise(r => setTimeout(r, speed));
    }

    input.disabled = false;
    input.focus();
  };

  const handleCommand = async (cmd) => {
    const args = cmd.trim().split(/\s+/);
    const baseCmd = args[0].toLowerCase();

    if (!baseCmd) return;

    history.push(cmd);
    historyIdx = history.length;

    printLog(`<span style="color: #34d399">guest@ayan:~$</span> ${cmd}`);

    switch (baseCmd) {
      case 'help':
        printLog(`Available commands:
  help      - Show this message
  clear     - Clear the terminal output
  theme     - Toggle light/dark mode (usage: theme --toggle)
  whoami    - Print a brief summary
  bio       - Read my biography (use -v or --verbose for full story)
  ls        - List contents (try: ls /interests)
  fetch     - Fetch remote data (try: fetch leetcode)
  status    - View system diagnostic boot log
  exit      - Close the terminal session`);
        break;

      case 'clear':
        clearTerminal();
        break;

      case 'theme':
        if (args[1] === '--toggle') {
          const themeBtn = document.getElementById('theme-toggle');
          if (themeBtn) themeBtn.click();
          printLog(`Theme toggled successfully.`);
        } else {
          printLog(`Usage: theme --toggle`, 'error');
        }
        break;

      case 'whoami':
        printLog(PERSONAL_DATA.biography.short);
        break;

      case 'bio':
        if (args.includes('--verbose') || args.includes('-v')) {
          await typeWriter(PERSONAL_DATA.biography.long);
        } else {
          printLog(PERSONAL_DATA.biography.short);
        }
        break;

      case 'ls':
        if (args[1] === '/interests') {
          const teasers = PERSONAL_DATA.interests_teasers;
          const randomTeaser = teasers[Math.floor(Math.random() * teasers.length)];
          printLog(randomTeaser);
        } else {
          printLog(`ls: ${args[1] || ''}: No such directory. Try 'ls /interests'`);
        }
        break;

      case 'fetch':
        if (args[1] === 'leetcode') {
          printLog('Fetching remote profile data from LeetCode...');
          input.disabled = true;
          await new Promise(r => setTimeout(r, 800)); // fake delay
          printLog(`
[ SUCCESS ] LeetCode Profile Extracted

Current Focus Areas:
- Segment Trees
- Dynamic Programming (State Machines)
- Graph Theory (Dijkstra, Tarjan)

Recent Activity: Consistent daily submissions.`);
          input.disabled = false;
          input.focus();
        } else {
          printLog(`fetch: unknown target '${args[1] || ''}'`);
        }
        break;

      case 'status':
        printLog(`[OK]     Kernel initialized (AyanOS 3.1-Pro)
[OK]     WebGL 3D Context acquired
[OK]     Raycaster tracking active
[WARN]   Distributed nodes experiencing simulated load
[OK]     Data pipeline intersection observers polling
[OK]     System running at nominal capacity`);
        break;

      case 'exit':
        toggleTerminal();
        break;

      case 'sudo':
        if (args.includes('--reveal')) {
          await typeWriter(PERSONAL_DATA.quirks.reveal, 10);
        } else {
          printLog(`ayan is not in the sudoers file. This incident will be reported.`);
        }
        break;

      default:
        const randomError = QUIRKY_ERRORS[Math.floor(Math.random() * QUIRKY_ERRORS.length)];
        printLog(`bash: ${baseCmd}: ${randomError}`, 'error');
    }
  };

  // Event Listeners
  window.addEventListener('keydown', (e) => {
    // Backtick or Ctrl+K
    if (e.key === '\`' || (e.ctrlKey && e.key === 'k')) {
      e.preventDefault();
      toggleTerminal();
    }
  });

  closeBtn.addEventListener('click', toggleTerminal);

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      handleCommand(input.value);
      input.value = '';
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIdx > 0) {
        historyIdx--;
        input.value = history[historyIdx];
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx < history.length - 1) {
        historyIdx++;
        input.value = history[historyIdx];
      } else {
        historyIdx = history.length;
        input.value = '';
      }
    }
  });
};

document.addEventListener('DOMContentLoaded', initDataPipeline);

// --- Phase 4: Client-Side Telemetry Dashboard ---
const initTelemetryDashboard = async () => {
  const starsVal = document.getElementById('telemetry-stars-val');
  const sizeVal = document.getElementById('telemetry-size-val');
  const svgStars = document.getElementById('sparkline-stars');
  const svgSize = document.getElementById('sparkline-size');

  if (!starsVal || !sizeVal || !svgStars || !svgSize) return;

  const CACHE_KEY = 'ayan_telemetry_cache';
  const CACHE_TTL = 3600 * 1000; // 1 hour

  let repoData = null;

  try {
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Date.now() - parsed.timestamp < CACHE_TTL) {
        repoData = parsed.data;
      }
    }

    if (!repoData) {
      const response = await fetch('https://api.github.com/users/ayan2809/repos?per_page=100');
      if (!response.ok) throw new Error('API Request Failed');
      const data = await response.json();

      // Filter out forks, sort chronologically
      repoData = data.filter(r => !r.fork).sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

      sessionStorage.setItem(CACHE_KEY, JSON.stringify({
        timestamp: Date.now(),
        data: repoData
      }));
    }

    // Aggregate Data
    let cumulativeStars = [];
    let cumulativeSize = [];
    let currentStars = 0;
    let currentSizeVals = 0; // kb

    // Add a synthetic 0 starting point
    cumulativeStars.push(0);
    cumulativeSize.push(0);

    repoData.forEach(repo => {
      currentStars += repo.stargazers_count;
      currentSizeVals += repo.size;
      cumulativeStars.push(currentStars);
      cumulativeSize.push(currentSizeVals);
    });

    starsVal.textContent = currentStars.toString();
    sizeVal.textContent = currentSizeVals.toLocaleString();

    // Draw SVG Sparklines
    const buildSparkline = (svgElement, dataPoints) => {
      if (dataPoints.length === 0) return;

      const width = 100;
      const height = 30;

      const min = Math.min(...dataPoints);
      const max = Math.max(...dataPoints) || 1; // Prevent div by 0

      const points = dataPoints.map((val, i) => {
        const x = (i / (dataPoints.length - 1)) * width;
        const y = height - (((val - min) / (max - min)) * height);
        return `${x},${y}`;
      });

      // Gradient Def
      let defs = svgElement.querySelector('defs');
      if (!defs) {
        defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        defs.innerHTML = `
          <linearGradient id="sparkline-gradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stop-color="var(--accent-primary)" />
            <stop offset="100%" stop-color="var(--accent-primary)" stop-opacity="0" />
          </linearGradient>
        `;
        svgElement.appendChild(defs);
      }

      // Path Curve (Catmull-Rom approximation for smooth curves)
      let d = `M ${points[0].split(',')[0]} ${points[0].split(',')[1]}`;
      for (let i = 1; i < points.length; i++) {
        const prev = points[i - 1].split(',').map(Number);
        const curr = points[i].split(',').map(Number);
        // simple curve proxy
        const cx = (prev[0] + curr[0]) / 2;
        d += ` Q ${cx} ${prev[1]} ${curr[0]} ${curr[1]}`;
      }

      // Add stroke path
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', d);
      path.setAttribute('class', 'sparkline-path');

      // Animate stroke
      const length = 150; // Approximated
      path.style.strokeDasharray = length;
      path.style.strokeDashoffset = length;
      svgElement.appendChild(path);

      // Add fill polygon
      const fillD = `${d} L ${width} ${height} L 0 ${height} Z`;
      const fillPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      fillPath.setAttribute('d', fillD);
      fillPath.setAttribute('class', 'sparkline-fill');
      fillPath.style.opacity = '0';
      svgElement.prepend(fillPath);

      // Trigger animation
      setTimeout(() => {
        path.style.transition = 'stroke-dashoffset 2s cubic-bezier(0.16, 1, 0.3, 1)';
        path.style.strokeDashoffset = '0';
        fillPath.style.transition = 'opacity 2s ease 0.5s';
        fillPath.style.opacity = '0.1';
      }, 100);
    };

    buildSparkline(svgStars, cumulativeStars);
    buildSparkline(svgSize, cumulativeSize);

  } catch (error) {
    console.error('Telemetry generation failed:', error);
    starsVal.textContent = 'ERR';
    sizeVal.textContent = 'ERR';
  }
};

// --- Phase 3 (V3.5): D3 Force-Directed Skills Graph ---
const initSkillsGraph = () => {
  const container = document.getElementById('skills-graph');
  if (!container || typeof d3 === 'undefined') return;

  // ── Color palette ─────────────────────────────────────────────
  const COLOR = {
    language: '#6366f1',
    infra: '#a855f7',
    database: '#22d3ee',
    framework: '#f59e0b',
    observability: '#ec4899',
  };

  // Fill = color at 30% opacity (hex alpha 4d)
  const FILL = (group) => `${COLOR[group]}4d`;

  const nodes = [
    { id: 'Python', group: 'language', hub: true, r: 32 },
    { id: 'Java', group: 'language', hub: true, r: 29 },
    { id: 'AWS', group: 'infra', hub: true, r: 34 },
    { id: 'Kubernetes', group: 'infra', hub: true, r: 32 },
    { id: 'OpenSearch', group: 'database', hub: true, r: 27 },
    { id: 'FastAPI', group: 'framework', hub: false, r: 16 },
    { id: 'Flask', group: 'framework', hub: false, r: 14 },
    { id: 'Spring Boot', group: 'framework', hub: false, r: 15 },
    { id: 'SQL', group: 'language', hub: false, r: 13 },
    { id: 'C++', group: 'language', hub: false, r: 12 },
    { id: 'Lambda', group: 'infra', hub: false, r: 16 },
    { id: 'S3', group: 'infra', hub: false, r: 14 },
    { id: 'EKS', group: 'infra', hub: false, r: 16 },
    { id: 'Docker', group: 'infra', hub: false, r: 15 },
    { id: 'Helm', group: 'infra', hub: false, r: 13 },
    { id: 'Terraform', group: 'infra', hub: false, r: 14 },
    { id: 'Jenkins', group: 'infra', hub: false, r: 13 },
    { id: 'PostgreSQL', group: 'database', hub: false, r: 15 },
    { id: 'MongoDB', group: 'database', hub: false, r: 14 },
    { id: 'Redis', group: 'database', hub: false, r: 14 },
    { id: 'Cassandra', group: 'database', hub: false, r: 13 },
    { id: 'DynamoDB', group: 'database', hub: false, r: 14 },
    { id: 'FAISS', group: 'database', hub: false, r: 12 },
    { id: 'Datadog', group: 'observability', hub: false, r: 15 },
    { id: 'Splunk', group: 'observability', hub: false, r: 14 },
    { id: 'Dynatrace', group: 'observability', hub: false, r: 13 },
  ];

  const links = [
    { source: 'Python', target: 'FastAPI' },
    { source: 'Python', target: 'Flask' },
    { source: 'Python', target: 'SQL' },
    { source: 'Java', target: 'Spring Boot' },
    { source: 'Java', target: 'SQL' },
    { source: 'AWS', target: 'Lambda' },
    { source: 'AWS', target: 'S3' },
    { source: 'AWS', target: 'EKS' },
    { source: 'AWS', target: 'DynamoDB' },
    { source: 'AWS', target: 'Terraform' },
    { source: 'AWS', target: 'Datadog' },
    { source: 'AWS', target: 'Splunk' },
    { source: 'Kubernetes', target: 'EKS' },
    { source: 'Kubernetes', target: 'Docker' },
    { source: 'Kubernetes', target: 'Helm' },
    { source: 'Kubernetes', target: 'Jenkins' },
    { source: 'Kubernetes', target: 'Dynatrace' },
    { source: 'OpenSearch', target: 'PostgreSQL' },
    { source: 'OpenSearch', target: 'MongoDB' },
    { source: 'OpenSearch', target: 'Redis' },
    { source: 'OpenSearch', target: 'Cassandra' },
    { source: 'OpenSearch', target: 'FAISS' },
    { source: 'Python', target: 'C++' },
  ];

  // ── Dimensions ────────────────────────────────────────────────
  const W = container.clientWidth || 800;
  const H = container.clientHeight || 540;
  const isMobile = window.innerWidth < 768 || 'ontouchstart' in window;

  // ── SVG ───────────────────────────────────────────────────────
  const svg = d3.select(container)
    .append('svg')
    .attr('width', W)
    .attr('height', H)
    .attr('aria-label', 'Interactive skills dependency map');

  const defs = svg.append('defs');

  // Per-color glow filters
  Object.entries(COLOR).forEach(([key, hex]) => {
    const f = defs.append('filter')
      .attr('id', `glow-${key}`)
      .attr('x', '-50%').attr('y', '-50%')
      .attr('width', '200%').attr('height', '200%');
    f.append('feGaussianBlur').attr('in', 'SourceGraphic').attr('stdDeviation', 6).attr('result', 'blur');
    const m = f.append('feMerge');
    m.append('feMergeNode').attr('in', 'blur');
    m.append('feMergeNode').attr('in', 'SourceGraphic');
  });

  // Subtle leaf glow
  const leafGlow = defs.append('filter').attr('id', 'glow-leaf');
  leafGlow.append('feGaussianBlur').attr('stdDeviation', 2).attr('result', 'blur');
  const lfm = leafGlow.append('feMerge');
  lfm.append('feMergeNode').attr('in', 'blur');
  lfm.append('feMergeNode').attr('in', 'SourceGraphic');

  // Zoomable group
  const g = svg.append('g');
  svg.call(d3.zoom().scaleExtent([0.35, 3]).on('zoom', (e) => g.attr('transform', e.transform)));

  // ── Simulation ────────────────────────────────────────────────
  const sim = d3.forceSimulation(nodes)
    .force('link', d3.forceLink(links).id(d => d.id)
      .distance(d => (d.source.hub && d.target.hub) ? 200 : 100)
      .strength(0.45))
    .force('charge', d3.forceManyBody().strength(d => d.hub ? -700 : -220))
    .force('center', d3.forceCenter(W / 2, H / 2).strength(0.08))
    .force('collision', d3.forceCollide().radius(d => d.r + 14))
    .force('bounds', () => {
      const pad = 50;
      for (const n of nodes) {
        if (n.x < pad) n.vx += (pad - n.x) * 0.08;
        if (n.x > W - pad) n.vx += (W - pad - n.x) * 0.08;
        if (n.y < pad) n.vy += (pad - n.y) * 0.08;
        if (n.y > H - pad) n.vy += (H - pad - n.y) * 0.08;
      }
    })
    .alphaDecay(0.025)
    .velocityDecay(0.4);

  // ── Links ─────────────────────────────────────────────────────
  const linkEls = g.append('g').attr('class', 'links-group')
    .selectAll('line')
    .data(links)
    .join('line')
    .attr('class', 'graph-link')
    .attr('stroke', d => COLOR[d.source.group] || '#555')
    .attr('stroke-dasharray', '5 4');

  // ── Nodes ─────────────────────────────────────────────────────
  const nodeEls = g.append('g').attr('class', 'nodes-group')
    .selectAll('g.graph-node')
    .data(nodes)
    .join('g')
    .attr('class', d => `graph-node${d.hub ? ' hub' : ''}`)
    .call(d3.drag()
      .on('start', (event, d) => {
        if (!event.active && !isMobile) sim.alphaTarget(0.3).restart();
        d.fx = d.x; d.fy = d.y;
      })
      .on('drag', (event, d) => { d.fx = event.x; d.fy = event.y; })
      .on('end', (event, d) => {
        if (!event.active && !isMobile) sim.alphaTarget(0);
        d.fx = null; d.fy = null;
      })
    );

  // Circle — richer fill
  nodeEls.append('circle')
    .attr('r', d => d.r)
    .attr('fill', d => FILL(d.group))
    .attr('stroke', d => COLOR[d.group])
    .style('filter', d => d.hub ? `url(#glow-${d.group})` : 'url(#glow-leaf)');

  // Hub labels — centered inside the circle
  nodeEls.filter(d => d.hub)
    .append('text')
    .attr('class', 'hub-label')
    .text(d => d.id);

  // Leaf labels — always visible below the circle
  nodeEls.filter(d => !d.hub)
    .append('text')
    .attr('class', 'leaf-label')
    .attr('dy', d => d.r + 5) // sit just below the circle edge
    .attr('fill', d => COLOR[d.group])
    .text(d => d.id);

  // ── Hover interactions ────────────────────────────────────────
  nodeEls
    .on('mouseenter', (event, hovered) => {
      const connectedIds = new Set([hovered.id]);
      links.forEach(l => {
        if (l.source.id === hovered.id) connectedIds.add(l.target.id);
        if (l.target.id === hovered.id) connectedIds.add(l.source.id);
      });

      linkEls.each(function (d) {
        const connected = d.source.id === hovered.id || d.target.id === hovered.id;
        d3.select(this).classed('link-highlighted', connected);
      });

      nodeEls.classed('dimmed', d => !connectedIds.has(d.id));
    })
    .on('mouseleave', () => {
      linkEls.classed('link-highlighted', false);
      nodeEls.classed('dimmed', false);
    });

  // ── Tick ──────────────────────────────────────────────────────
  sim.on('tick', () => {
    linkEls
      .attr('x1', d => d.source.x).attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x).attr('y2', d => d.target.y);
    nodeEls.attr('transform', d => `translate(${d.x},${d.y})`);
  });

  // ── Mobile: static layout ─────────────────────────────────────
  if (isMobile) {
    sim.stop();
    for (let i = 0; i < 200; ++i) sim.tick();
    linkEls.attr('x1', d => d.source.x).attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x).attr('y2', d => d.target.y);
    nodeEls.attr('transform', d => `translate(${d.x},${d.y})`);
  }

  // ── IntersectionObserver ──────────────────────────────────────
  if (!isMobile) {
    new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { if (sim.alpha() >= sim.alphaMin()) sim.restart(); }
        else sim.stop();
      });
    }, { threshold: 0.1 }).observe(container);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  initDataPipeline();
  initDevTerminal();
  initTelemetryDashboard();
  initSkillsGraph();
});
