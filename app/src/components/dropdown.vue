<template>
    <div class="drop-down-parent">
        <!-- <select class="drop-down" v-model="value">
            <option
                :value="item[keys]"
                v-for="(item, index) in list"
                :key="index"
                >{{ item[values] }}</option
            >
        </select> -->
        <div
            class="drop-down-show"
            @click.stop="updateShow()"
            :style="{
                height: height,
                border: border,
                width: width,
                'border-radius': borderRadius,
                'background-color': backgroundColor,
                color: color,
                border: mainBorder
            }"
        >
            <span
                :style="{ 'font-size': fontSize }"
                style="text-align:left;margin-left:0.24rem"
                >{{ text }}</span
            >
            <van-icon
                name="arrow-down"
                :size="iconSize"
                class="drop-arrow"
                :style="{ transform: `rotate(${show ? 180 : 0}deg)` }"
                :color="iconColor"
            />
            <div
                class="drop-down-list"
                :style="{
                    'max-height': listMaxItem * parseFloat(listHeight) + 'rem',
                    height: show
                        ? Math.min(listMaxItem, list.length) *
                              parseFloat(listHeight) +
                          0.1 +
                          'rem'
                        : 0,
                    top: parseFloat(height) + 0.01 + 'rem',
                    'background-color': listBackColor,
                    'min-width': width,
                    border: `1px solid ${
                        show ? listBorderColor : 'rgba(0,0,0,0)'
                    }`
                }"
            >
                <div @mousewheel.prevent.stop="mousewheel">
                    <div
                        :style="{
                            'min-width': width,
                            height: listHeight,
                            'line-height': listHeight,
                            'font-size': fontSize,
                            color:
                                item[keys] == value
                                    ? `${checkColor}!important`
                                    : importList.includes(item[keys])
                                    ? backgroundColor
                                    : listItemColor
                        }"
                        class="drop-down-item"
                        v-for="(item, index) in list"
                        :key="index"
                        @click.prevent.stop="updateValue(item, index)"
                    >
                        <span>{{ item[values] }}</span>
                        <span v-if="importList.includes(item[keys])"
                            ><img
                                src="../assets/images/home/icon_ren.png"
                                alt=""
                        /></span>
                    </div>
                </div>
            </div>
        </div>

        <div
            class="drop-down-fixed"
            v-if="show"
            @click.prevent.stop="closeShow()"
            @mousewheel.prevent.stop="mousewheel"
        ></div>
    </div>
</template>

<script >
import uuidv1 from "uuid/v1";
export default {
    name: "drop-down",
    props: {
        mainBorder: {
            type: String,
            default: "none"
        },
        iconColor: {
            type: String,
            default: "white"
        },
        iconSize: {
            type: String,
            default: "0.24rem"
        },
        fontSize: {
            type: String,
            default: "0.2rem"
        },
        height: {
            type: String,
            default: "0.5rem"
        },
        border: {
            type: String,
            default: "none"
        },
        width: {
            type: String,
            default: "2.6rem"
        },
        borderRadius: {
            type: String,
            default: "0.08rem"
        },
        backgroundColor: {
            type: String,
            default: "rgb(4, 151, 255)"
        },
        color: {
            type: String,
            default: "white"
        },
        list: {
            type: Array,
            default: () => []
        },
        values: {
            type: String,
            default: "name"
        },
        keys: {
            type: String,
            default: "id"
        },
        listBorderColor: {
            type: String,
            defalut: "rgba(255,255,255,255)"
        },
        listBackColor: {
            type: String,
            default: "#fff"
        },
        listHeight: {
            type: String,
            default: "0.54rem"
        },
        listItemColor: {
            type: String,
            default: "#666"
        },
        listMaxItem: {
            type: Number,
            default: 7
        },
        listBorder: {
            type: String,
            default: "1px solid blue"
        },
        checkColor: {
            type: String,
            default: "red"
        },
        importList: {
            type: Array,
            default: () => []
        },
        init: {
            type: Function,
            default: function() {
                return this.list[0];
            }
        }
    },
    watch: {
        list() {
            if (!this.value) {
                this.updateValue(this.init());
            }
        }
        // value() {
        //     let item = this.list.find(el => el[this.keys] == this.value);
        //     if (item) this.updateValue(item);
        // }
    },
    data() {
        return {
            show: false,
            value: "",
            text: ""
        };
    },
    methods: {
        mousewheel() {},
        updateShow() {
            this.show = !this.show;
        },
        closeShow() {
            this.show = false;
        },
        updateValue(item) {
            if (!item) return;
            this.value = item[this.keys] === undefined ? "" : item[this.keys];
            this.text =
                item[this.values] === undefined ? "" : item[this.values];
            this.closeShow();
            this.$emit("on-change", item);
        },
        updateOut(val) {
            let find = this.list.find(el => el[this.keys] == val);
            if (find) {
                this.updateValue(find);
            }
        }
    },
    created() {
        this.updateValue(this.init());
    },
    mounted() {}
};
</script>

<style scoped lang="scss">
.drop-down-show {
    display: inline-flex;
    position: relative;
    align-items: center;
    justify-content: center;
    padding-right: 0.16rem;
    & > span {
        flex: 1;
        text-align: center;
        text-overflow: -o-ellipsis-lastline;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        -webkit-box-orient: vertical;
    }
}
.drop-arrow {
    transition: all 150ms linear;
}
.drop-down-fixed {
    position: fixed;
    width: 750px;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 100;
}
.drop-down-list {
    position: absolute;
    left: 0;
    transition: height 100ms linear;
    z-index: 200;
    overflow: hidden;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    & > div {
        flex: 1;
        overflow: auto;
    }
}
.drop-down-item {
    display: flex;
    align-items: center;
    flex-shrink: 0;
    justify-content: space-between;
    padding: 0 0.2rem;
    img {
        width: 0.24rem;
        flex-shrink: 0;
    }
    & > span:first-of-type {
        flex: 1;
        white-space: nowrap;
        overflow: hidden;
        max-width: 7em;
        text-overflow: ellipsis;
    }
}
.drop-down-parent {
    flex-shrink: 0;
    display: flex;
    align-items: center;
}
</style>
