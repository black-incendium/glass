export type newProgressorDataType = {

    startValue: number,
    targetValue: number,
    duration: number,
    startCallback: Function | null,
    updateCallback: Function | null,
    finishCallback: Function | null,
}

export type progressorStateType = {

    id: symbol,
    startValue: number,
    targetValue: number,
    duration: number,
    startCallback: Function | null,
    updateCallback: Function | null,
    finishCallback: Function | null,
    isRunning: boolean
    timeElapsedSinceStart: number,
    currentValue: number,
}

export type progressorApiType = {

    start: () => void,
    stop: (shouldCallFinishCallback: boolean) => void,
    updateData: (progressorData: newProgressorDataType) => void,
    callStartCallback: () => void,
    callFinishCallback: () => void,
    callUpdateCallback: <callbackDataType>(callbackData: callbackDataType) => void,
}

export type progressorType = progressorStateType & progressorApiType;

export const progressorsManager = (()=>{

    let progressors = {} as Record <symbol, progressorType>;
    let runningProgressors = [] as progressorType[];

    const progressorApi = {

        start: function(): void {

            if (this.isRunning === true) return;

            this.isRunning = true;
            this.timeElapsedSinceStart = 0;
            runningProgressors.push(this);

            this.callStartCallback();
        },

        stop: function(shouldCallFinishCallback = false): void {

            if (this.isRunning === false) return;

            this.isRunning = false;
            runningProgressors = runningProgressors.filter(progressor => progressor !== this);

            if (shouldCallFinishCallback === true) {

                this.callFinishCallback();
            }
        },

        callStartCallback: function(): void {

            if (this.startCallback === null) return;

            this.startCallback();
        },

        callUpdateCallback: function<callbackDataType>(callbackData?: callbackDataType): void {

            if (this.updateCallback === null) return;

            this.updateCallback();
        },

        callFinishCallback: function(): void {

            if (this.finishCallback === null) return;

            this.finishCallback();
        },

        updateData: function(progressorData: newProgressorDataType): void {

            this.startValue = progressorData.startValue ?? this.startValue;
            this.targetValue = progressorData.targetValue ?? this.targetValue;
            this.duration = progressorData.duration ?? this.duration;
            this.startCallback = progressorData.startCallback ?? this.startCallback;
            this.updateCallback = progressorData.updateCallback ?? this.updateCallback;
            this.finishCallback = progressorData.finishCallback ?? this.finishCallback;
        }

    } as progressorType as progressorApiType;

    function getNewProgressor(progressorData: newProgressorDataType): progressorType {

        const progressorState: progressorStateType = {

            id: Symbol(),
            startValue: progressorData.startValue ?? 0,
            targetValue: progressorData.targetValue ?? 0,
            duration: progressorData.duration ?? 1000,
            startCallback: progressorData.startCallback ?? null,
            updateCallback: progressorData.updateCallback ?? null,
            finishCallback: progressorData.finishCallback ?? null,
            isRunning: false,
            timeElapsedSinceStart: 0,
            currentValue: 0
        }

        const result = Object.assign(Object.create(progressorApi), progressorState);

        progressors[result.id] = result;

        return result
    }

    function updateProgressors(deltaTime: number) {

        runningProgressors.forEach(progressor => {

            progressor.timeElapsedSinceStart = Math.min(progressor.duration, progressor.timeElapsedSinceStart + deltaTime);

            const progress = progressor.timeElapsedSinceStart / progressor.duration;

            progressor.currentValue = progressor.startValue * (1 - progress) + progressor.targetValue * progress;

            if (progressor.timeElapsedSinceStart === progressor.duration) {

                progressor.stop(true);
            }

            progressor.callUpdateCallback<number>(progressor.currentValue);
        });
    }

    return {

        getNewProgressor,
        updateProgressors,
    }

})();