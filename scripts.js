console.log("Script loaded");

//Popups
function popupShow(popupName, time) {
    let popups = document.querySelectorAll('.popup')
    popups.forEach((popup) => {
        if (popup.classList.contains('popupActive')) {
            console.log("Popup hide");
            popup.classList.remove('popupActive');
        }
    });

    console.log("Popup show");
    let popup = document.querySelector(`.${popupName}`);
    popup.classList.add('popupActive');
    setTimeout(function() {
        console.log("Popup hide");
        popup.classList.remove('popupActive');
    }, time * 1000);
}

//Background changing
const background = document.getElementById('bg');
let oldNumber = 0;

function bgChange(number = Math.floor(Math.random() * 6), time = 2) {
    if (bgChanging) {
        console.log('Theme still changing');
        return;
    }
    
    if (number == oldNumber) {
        console.log('Theme skip');
        return;
    }

    console.log('New theme: ', number);
    
    const background = document.getElementById('bg');
    const hero = document.getElementById('hero');
    const themeButtons = document.getElementsByClassName('theme');

    themes.forEach(element => {
        element.classList.remove('themeActive');
    });

    oldNumber = number;
    hero.classList.add('heroBlack');

    setTimeout(() => {
        background.classList.remove('black', 'blue', 'red', 'green', 'purple', 'white');

        if (number == 0) {
            background.classList.add('black');
            popupShow('bgBlack', time);
            document.getElementsByClassName('black')[1].classList.add('themeActive');
        } else if (number == 1) {
            background.classList.add('blue');
            popupShow('bgBlue', time);
            document.getElementsByClassName('blue')[1].classList.add('themeActive');
        } else if (number == 2) {
            background.classList.add('red');
            popupShow('bgRed', time);
            document.getElementsByClassName('red')[1].classList.add('themeActive');
        } else if (number == 3) {
            background.classList.add('green');
            popupShow('bgGreen', time);
            document.getElementsByClassName('green')[1].classList.add('themeActive');
        } else if (number == 4) {
            background.classList.add('purple');
            popupShow('bgPurple', time);
            document.getElementsByClassName('purple')[1].classList.add('themeActive');
        } else if (number == 5) {
            background.classList.add('white');
            popupShow('bgWhite', time);
            document.getElementsByClassName('white')[1].classList.add('themeActive');
        }

        hero.classList.remove('heroBlack');
    }, 500);
};

let bgChanging = false;
let shuffle = false;

const shuffleButton = document.getElementById('shuffle');

shuffleButton.addEventListener('click', function() {
    shuffle = !shuffle;
    console.log('Shuffle On');

    themes.forEach(element => {
        element.classList.remove('themeActive');
    });

    shuffleButton.classList.add('themeActive');

    bgChange(undefined, 0);
    popupShow('shuffleOn', 2);
});

setInterval(() => {    
    if (shuffle) {
        bgChange();
    } else {
        console.log('Themes not shuffled');
    }
}, 25000);

const themes = document.querySelectorAll('.theme');
themes.forEach(element => {
    element.addEventListener('click', function() {
        bgChanging = true;
        console.log('bgChanging = ', bgChanging);
        shuffle = false;
    
        setTimeout(() => {
            bgChanging = false;
            console.log('bgChanging = ', bgChanging);
        }, 1000);
    
    });
});

//Project locking and hovering
const projects = document.querySelectorAll('.project');

projects.forEach((project) => {
    if (window.innerWidth > 1000) {

        project.addEventListener('click', function() {
            console.log("Locking function");
            if (project.classList.contains('locked')) {
                project.classList.remove('locked');
                popupShow('projHide', 2);
                console.log("Project unlock");
            } 
            else {
                project.classList.add('locked');
                popupShow('projShow', 2);
                console.log("Project lock");
            }
        });
    } else {
        //project.classList.remove('appearRight', 'appearLeft', 'appearBottom');
        project.classList.add('locked');
    }
});

projects.forEach((project) => {
    project.addEventListener('mouseenter', function() {
        const title = project.getElementsByTagName('h3')[0];
        title.classList.add('highlight');
        console.log("Project hover");
    })

    project.addEventListener('mouseleave', function() {
        const title = project.getElementsByTagName('h3')[0];
        title.classList.remove('highlight');
        console.log("Project unhover");
    });
});

//Appearing animation
const appearElements = document.querySelectorAll('.appearRight, .appearLeft, .appearBottom');

function appearObserverCallback(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.remove('appearRight', 'appearLeft', 'appearBottom');
            appearObserver.unobserve(entry.target);
            console.log("Element appear");
        }
    });
}

let treshold = 0.5;

if (window.innerWidth < 1000) {
    treshold = 0.1;
}


const appearObserver = new IntersectionObserver(appearObserverCallback, { threshold: treshold });

setTimeout(appearElements.forEach(element => appearObserver.observe(element)), 1000);

//Page Selector
const projectsPage = document.getElementById('projects');
const skillsPage = document.getElementById('skills');
const journeyPage = document.getElementById('journey');

function selector(page) {
    if (page == 1) {
        projectsPage.classList.add('hide');
        skillsPage.classList.remove('hide');
        journeyPage.classList.add('hide');
        console.log("Page 1");
    }
    else if (page == 2) {
        projectsPage.classList.remove('hide');
        skillsPage.classList.add('hide');
        journeyPage.classList.add('hide');
        console.log("Page 2");
    }
    else if (page == 3) {
        projectsPage.classList.add('hide');
        skillsPage.classList.add('hide');
        journeyPage.classList.remove('hide');
        console.log("Page 3");
    }
}

//Contact form
let formSent = false

function formCheck() {
    setTimeout(() => {
        if (formSent) {
            popupShow('formSuccess', 2);
        } else {
            popupShow('formError', 2);
        }
    }, 2000);
}

document.querySelector('form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);

    const data = {};
    formData.forEach((value, key) => (data[key] = value));

    formCheck();

    const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    if (response.ok) {
        formSent = true
        form.reset();
    }
});

//Scroll to top and background blur
const button = document.getElementById("scrollToTop");
const hero = document.getElementById('hero');
let scrolling = false;
let scrollHeight = 1.5;

setInterval(() => {
    if (window.innerWidth > 1000) {
        scrollHeight = 1.5;
    } else {
        scrollHeight = 2;
    }
    if (window.scrollY > window.innerHeight / scrollHeight && scrolling == false) {
        button.classList.remove('fade');
        hero.classList.add('bgfade');
    }
    else {
        button.classList.add('fade');
        hero.classList.remove('bgfade');
    }
}, 100);

button.addEventListener("click", function() {
    console.log("Scroll to top");
    scrolling = true;
    window.scrollTo({top: 0});
    button.classList.add('rotate', 'fade');
    setTimeout(() => {
        button.classList.remove('rotate');
    }, 500);

    setTimeout(() => {
        scrolling = false;
        console.log("Scrolling finished");
    }, 1000);
});

//Form shenanigans
const formDiv = document.getElementById('form');
const formTitle = formDiv.getElementsByTagName('h2')[0];
const email = formDiv.getElementsByTagName('a')[0];

formDiv.addEventListener('mouseenter', function() {
    formTitle.classList.add('formOpen');
    console.log("Form hover");
});

formDiv.addEventListener('mouseleave', function() {
    formTitle.classList.remove('formOpen');
    console.log("Form unhover");
});

email.addEventListener('click', function() {
    navigator.clipboard.writeText('puk.ondrej@gmail.com');
    popupShow('clipboard', 2);
    console.log("Email copied");
});

//Heropage hover animation
const h1 = document.getElementsByTagName('h1')[0];
a = hero.getElementsByTagName('a')[0];

a.addEventListener('mouseenter', function() {
    h1.classList.add('heroHover');
    console.log("Hero hover");
});

a.addEventListener('mouseleave', function() {
    h1.classList.remove('heroHover');
    console.log("Hero unhover");
});