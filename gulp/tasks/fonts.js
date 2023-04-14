import fs from 'fs';
import fonter from 'gulp-fonter';
import ttf2woff2 from 'gulp-ttf2woff2';
import { fontWeight } from '../config/var.js';

export const otfToTtf = () => {
    return app.gulp.src(`${app.path.srcFolder}/fonts/*.otf`, {})
        .pipe(app.plugins.plumber(
            app.plugins.notify.onError({
                title: "FONTS",
                message: "Error: <%= error.message %>"
            })
        ))
        .pipe(fonter({
            formats: ['ttf']
        }))
        .pipe(app.gulp.dest(`${app.path.srcFolder}/fonts/`))
}

export const ttfToWoff = () => {
    return app.gulp.src(`${app.path.srcFolder}/fonts/*.ttf`, {})
        .pipe(app.plugins.plumber(
            app.plugins.notify.onError({
                title: "FONTS",
                message: "Error: <%= error.message %>"
            })
        ))
        .pipe(fonter({
            formats: ['woff']
        }))
        .pipe(app.gulp.dest(`${app.path.build.fonts}`))
        .pipe(app.gulp.src(`${app.path.srcFolder}/fonts/*.ttf`))
        .pipe(ttf2woff2())
        .pipe(app.gulp.dest(`${app.path.build.fonts}`))    
}

export const fontsStyle = () => {
    let fontsFile = `${app.path.srcFolder}/scss/fonts.scss`;

    fs.readdir(app.path.build.fonts, function (err, fontsFiles) {
        if (fontsFiles) {
            if (!fs.existsSync(fontsFile)) {
                fs.writeFile(fontsFile, '', cb);
                let newFileOnly;
                for(let i = 0; i < fontsFiles.length; i++) {
                    let fontFileName = fontsFiles[i].split('.')[0];
                    if (newFileOnly != fontFileName) {
                        let arr = fontFileName.split("-");
                        if (arr.length > 1) {
                            if (arr[1] === 'Italic') {
                                arr[1] = "Regular";
                                arr.push("Italic");
                            }  else {
                                if (arr[1].search("Italic") !=  -1) {
                                    const newItem = arr[1].replace("Italic", "");
                                    arr.pop();
                                    arr.push(newItem, "Italic");
                                } else {
                                    arr.push("normal");
                                }
                            }
                        } else {
                            arr = [];
                            arr.push(value, 'regular', 'normal');
                        }

                        fs.appendFile(fontsFile,`@font-face {\n\tfont-family: ${arr[0]};\n\tfont-display: swap;\n\tsrc: url("../fonts/${fontFileName}.woff2") format("woff2"), url("../fonts/${fontFileName}.woff") format("woff2");\n\tfont-weight: ${fontWeight[arr[1]]};\n\tfont-style: ${arr[2]};\n}\r\n`, cb);
                        newFileOnly = fontFileName;
                    }
                }
            } else  {
                console.log("File scss/fonts.scss exist for update need delete file");    
            }
        }
    });

    return app.gulp.src(`${app.path.srcFolder}`);
    function cb() {}
};