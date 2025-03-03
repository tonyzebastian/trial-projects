const svg = document.querySelector('svg');
const circles = document.querySelectorAll('#Circle_0, #Circle_1, #Circle_2, #Circle_3, #Circle_4');

svg.addEventListener('click', () => {
    circles.forEach(circle => {
        circle.classList.add('clicked');
    });
});