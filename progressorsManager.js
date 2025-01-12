export const progressorsManager = (()=>{

    let progressors = {};
    let runningProgressorIds = [];
    let progressorStates = {};

    function getNewProgressor(progressorData) {

        const id = Symbol();

        progressorStates[id] = {

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

        function start() {

            if (progressorStates[id].isRunning === true) return;

            progressorStates[id].isRunning = true;
            progressorStates[id].timeElapsedSinceStart = 0;
            runningProgressorIds.push(id);

            callStartCallback();
        }

        function stop(shouldCallFinishCallback = false) {

            if (progressorStates[id].isRunning === false) return;

            progressorStates[id].isRunning = false;
            runningProgressorIds = runningProgressorIds.filter(progressorId => progressorId !== id);

            if (shouldCallFinishCallback === true) {

                callFinishCallback()
            }
        }

        function updateData(progressorData) {

            const startCallback = progressorData.startCallback === null ? null : (progressorData.startCallback ?? progressorStates[id].startCallback);
            const updateCallback = progressorData.updateCallback === null ? null : (progressorData.updateCallback ?? progressorStates[id].updateCallback);
            const finishCallback = progressorData.finishCallback === null ? null : (progressorData.finishCallback ?? progressorStates[id].finishCallback);

            progressorStates[id] = {

                startValue: progressorData.startValue ?? progressorStates[id].startValue,
                targetValue: progressorData.targetValue ?? progressorStates[id].targetValue,
                duration: progressorData.duration ?? progressorStates[id].duration,
                startCallback: startCallback,
                updateCallback: updateCallback,
                finishCallback: finishCallback,
                isRunning: progressorStates[id].isRunning,
                timeElapsedSinceStart: progressorStates[id].timeElapsedSinceStart
            };
        }

        function callStartCallback() {

            if (progressorStates[id].startCallback === null) return;

            progressorStates[id].startCallback();
        }

        function callFinishCallback() {

            if (progressorStates[id].finishCallback === null) return;

            progressorStates[id].finishCallback();
        }

        const progressor = {

            start,
            stop,
            updateData,
            id
        };

        progressors[id] = progressor;

        return progressor;
    }

    function updateProgressors(deltaTime) {

        runningProgressorIds.forEach(progressorId => {

            const progressorState = progressorStates[progressorId];

            progressorState.timeElapsedSinceStart = Math.min(progressorState.duration, progressorState.timeElapsedSinceStart + deltaTime);

            const progress = progressorState.timeElapsedSinceStart / progressorState.duration;

            progressorState.currentValue = progressorState.startValue * (1 - progress) + progressorState.targetValue * progress;

            if (progressorState.timeElapsedSinceStart === progressorState.duration) {

                progressors[progressorId].stop(true);
            }

            if (progressorState.updateCallback === null) return;

            progressorState.updateCallback(progressorState.currentValue);
        });
    }

    return {

        getNewProgressor,
        updateProgressors,
    }

})();