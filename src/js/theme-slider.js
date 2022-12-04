const THEME_KEY = "themKey";
const checkBox = document.querySelector('#slider');

checkBox.addEventListener('change', onBoxChange);

function onBoxChange(event) {
    const { target } = event;
    console.log('check', target.checked)
    const localVariable = target.checked ? 'theme-dark' : 'theme-light';
    document.body.className = localVariable;
    save(THEME_KEY, localVariable);
}

const save = (key, value) => {
    try {
        const serializedState = JSON.stringify(value);
        localStorage.setItem(key, serializedState);
    } catch (error) {
        console.error('Set state error: ', error.message);
    }
};

const load = key => {
    try {
        const serializedState = localStorage.getItem(key);

        return serializedState === null ? undefined : JSON.parse(serializedState);
    } catch (error) {
        console.error('Get state error: ', error.message);
    }
};

(() => {
    const savedTheme = load(THEME_KEY);
    if (savedTheme !== undefined && savedTheme === "theme-dark") {
        checkBox.checked = true;
        document.body.className = savedTheme;
    }
})()