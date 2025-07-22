document.addEventListener('DOMContentLoaded', () => {
    // --- 3D Hero Background using Three.js ---
    // This script creates a subtle, animated particle background
    let scene, camera, renderer, particles, mouseX = 0, mouseY = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    function initHero3D() {
        const canvas = document.getElementById('hero-3d-bg');
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
        camera.position.z = 1000;

        const material = new THREE.PointsMaterial({
            color: 0x3b82f6, // Blue 500
            size: 2,
            blending: THREE.AdditiveBlending,
            transparent: true,
            opacity: 0.7
        });

        const geometry = new THREE.BufferGeometry();
        const vertices = [];
        const numParticles = 5000;

        for (let i = 0; i < numParticles; i++) {
            const x = Math.random() * 2000 - 1000;
            const y = Math.random() * 2000 - 1000;
            const z = Math.random() * 2000 - 1000;
            vertices.push(x, y, z);
        }
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        particles = new THREE.Points(geometry, material);
        scene.add(particles);

        renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);

        document.querySelector('.hero-section').addEventListener('mousemove', onDocumentMouseMove);
        window.addEventListener('resize', onWindowResize);
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function onDocumentMouseMove(event) {
        mouseX = (event.clientX - windowHalfX) / 2;
        mouseY = (event.clientY - windowHalfY) / 2;
    }

    function animateHero3D() {
        requestAnimationFrame(animateHero3D);
        const time = Date.now() * 0.00005;
        camera.position.x += (mouseX - camera.position.x) * 0.05;
        camera.position.y += (-mouseY - camera.position.y) * 0.05;
        camera.lookAt(scene.position);
        particles.rotation.x = time * 0.2;
        particles.rotation.y = time * 0.4;
        renderer.render(scene, camera);
    }
    
    initHero3D();
    animateHero3D();

    // --- Scroll-triggered Animations ---
    const scrollElements = document.querySelectorAll('.scroll-fade-in');
    const elementInView = (el, dividend = 1) => {
        const elementTop = el.getBoundingClientRect().top;
        return (
            elementTop <= (window.innerHeight || document.documentElement.clientHeight) / dividend
        );
    };

    const displayScrollElement = (element) => {
        element.classList.add('is-visible');
    };

    const handleScrollAnimation = () => {
        scrollElements.forEach((el) => {
            if (elementInView(el, 1.25)) {
                displayScrollElement(el);
            }
        });
    };
    window.addEventListener('scroll', handleScrollAnimation);
    handleScrollAnimation(); // Initial check

    // --- Demand Analysis Chart.js ---
    const chartCanvas = document.getElementById('demand-chart');
    if (chartCanvas) {
        const ctx = chartCanvas.getContext('2d');
        const demandChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Present Demand', 'Next 12 Months', '3-Year Outlook'],
                datasets: [{
                    label: 'Job Openings (in thousands)',
                    data: [0, 0, 0], // Initial data, will be animated in
                    backgroundColor: [
                        'rgba(59, 130, 246, 0.6)', // Blue
                        'rgba(34, 197, 94, 0.6)', // Green
                        'rgba(139, 92, 246, 0.6)'  // Violet
                    ],
                    borderColor: [
                        'rgba(59, 130, 246, 1)',
                        'rgba(34, 197, 94, 1)',
                        'rgba(139, 92, 246, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: '#e2e8f0' // Slate 200
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.dataset.label}: ${context.raw}k`; // Corrected line
                            }
                        }
                    }
                }
            }
        });

        // Animate chart when it becomes visible
        const chartObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                demandChart.data.datasets[0].data = [50, 65, 90]; // Final data
                demandChart.update();
                chartObserver.unobserve(chartCanvas); // Animate only once
            }
        }, { threshold: 0.5 });

        chartObserver.observe(chartCanvas);
    }
});
