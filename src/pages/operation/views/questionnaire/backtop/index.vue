<template>
    <div class="backTop">
        <i @click="backTop">▲</i>
    </div>
</template>

<script>
    export default {
        name:'backTop',
        methods: {
            backTop() {
                this.$emit('backTop');
            }
        }
    }
</script>

<style lang="scss" scoped>
    .backTop {
        background-color: #fff;
        position: fixed;
        right: 100px;
        bottom: 150px;
        width: 40px;
        height: 40px;
        size: 40px;
        border-radius: 20px;
        cursor: pointer;
        transition: .3s;
        box-shadow: 0 0 6px rgba(0, 0, 0, .12);
        z-index: 5;

        i {
            color: #409eff;
            display: block;
            line-height: 40px;
            text-align: center;
            font-size: 18px;
        }
    }
</style>