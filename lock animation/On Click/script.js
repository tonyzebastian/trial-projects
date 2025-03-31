const svg = document.querySelector('svg');
const circles = document.querySelectorAll('#Circle_0, #Circle_1, #Circle_2, #Circle_3, #Circle_4');
const lock = document.getElementById('lock');

svg.addEventListener('click', () => {
    circles.forEach(circle => {
        circle.classList.add('clicked');
    });
    lock.classList.add('unlocked');
});