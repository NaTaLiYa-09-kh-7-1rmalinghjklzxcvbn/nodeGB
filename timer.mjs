import { EventEmitter } from 'node:events';
const emitter = new EventEmitter();
const [dateNew] = process.argv.slice(2);

const parsDate = (dateString) => {
    const [hour, day, month, year] = dateString.split('-')
    return new Date(Date.UTC(year, month - 1, day, hour))
}

const dateFuture = parsDate(dateNew)

const timerCount = (dateFuture) => {
    const dateNow = new Date();
    if (dateNow >= dateFuture) {
        emitter.emit('timerEnd')
    } else {
        const start = new Date(dateFuture)
        const diff = start - dateNow
        console.clear()
        console.log(getFinishDate(diff));
    }
}
const getFinishDate = (diff) => {
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const mins = Math.floor((diff / 1000 / 60) % 60);
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const secs = Math.floor((diff / 1000) % 60);
    return {
        days, hours, mins, secs
    };
}

const TimerEnd = (timerId) => {
    clearInterval(timerId)
    console.log('timer end');
}

const timerId = setInterval(() => {
    emitter.emit('timerStart', dateFuture)
}, 1000)

emitter.on('timerStart', timerCount)
emitter.on('timerEnd', () => {
    TimerEnd(timerId)
})