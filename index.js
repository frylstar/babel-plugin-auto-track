const { addDefault } = require("@babel/helper-module-imports")
/**
 * 引入模块这种功能显然很多插件都需要，这种插件之间的公共函数会放在 helper，使用 @babel/helper-module-imports。
 * 1. 引入 tracker 模块。如果已经引入过就不引入，没有的话就引入，
 * 2. 并且生成个唯一 id 作为标识符对所有函数在函数体开始插入 tracker 的代码
 * 第一个参数可以拿到 types、template 等常用包的 api，不需要单独引入这些包。
 * 作为插件用的时候，并不需要自己调用 parse、traverse、generate，只需要提供一个 visitor 函数，在这个函数内完成转换功能。
 */
module.exports = ({ types: t, template }, options = {}) => {
    const { trackerPath } = options;

    return {
        visitor: {
            Program: {
                // 在遍历 ImportDeclaration 时没有找到 tracker 模块，就会在遍历结束后（Program 的 exit 阶段）引入 tracker 模块并将生成的唯一 ID 存入 state。
                exit(path, state) {
                    if (!state.trackerImportId) {
                        const importUid = path.scope.generateUid(trackerPath)
                        addDefault(path, trackerPath, { nameHint: importUid })
                    }
                }
            },
            ImportDeclaration(path, state) {
                const requirePath = path.get('source').node.value; // 'tracker'
                // 如果引入了 tracker 模块，就记录 id 到 state，并用 path.stop 来终止后续遍历；
                // 没有就引入 tracker 模块，用 generateUid 生成唯一 id，然后放到 state。
                if (requirePath === trackerPath) {
                    const specifierPath = path.get('specifiers.0')
                    state.trackerImportId = specifierPath.get('local').toString();
                    console.log(state.trackerImportId, 'state.trackerImportId')
                
                    path.stop(); // 找到了就终止遍历
                }
            }
        }
    }
}