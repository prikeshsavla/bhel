class CountDown {
    duration: number;
    secondsLeft: number;
    onChange: Function;
    private counterInterval: any;
    constructor(duration: number, onChange: Function) {
        this.duration = duration
        this.secondsLeft = duration
        this.onChange = onChange;
    }

    start() {
        this.onChange(this.secondsLeft, 'start');
        this.counterInterval = setInterval(() => {
            --this.secondsLeft;
            this.onChange(this.secondsLeft, 'change');
            if (this.secondsLeft == 0) {
              clearInterval(this.counterInterval);
            }
          }, 1000)
    }

    stop() {
        this.secondsLeft = 0;
        this.onChange(0, 'stop');
        clearInterval(this.counterInterval);
    }
}

export {CountDown}