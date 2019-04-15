package com.tifenpai.upload.controller;

import com.tifenpai.upload.common.utils.FastDFSUtil;
import com.tifenpai.upload.common.utils.OlsResult;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.InputStream;

/**
 * @author waver
 * @date 2019.4.12 11:03
 */
@Controller
@RequestMapping("/")
public class FastDfsController {


    @Value("${dfs.host}")
    private String host;
    @Value("${dfs.group}")
    private String group;
    @Value("${dfs.filePath}")
    private String filePath;

    @GetMapping("/{path1}")
    @ResponseBody
    public void download(HttpServletResponse response, @PathVariable String path1) {
        String path = filePath + path1;
        getFileBytes(response, path);
    }

    @GetMapping("/{path1}/{path2}")
    @ResponseBody
    public void download(HttpServletResponse response, @PathVariable String path1, @PathVariable String path2) {
        String path = path1 + "/" + path2;
        getFileBytes(response, path);
    }

    @GetMapping("/{path1}/{path2}/{path3}")
    @ResponseBody
    public OlsResult download(HttpServletResponse response, @PathVariable String path1, @PathVariable String path2, @PathVariable String path3) {
        String path = group + filePath + path1 + "/" + path2 + "/" + path3;
        getFileBytes(response, path);
        return OlsResult.ok(path);
    }


    @RequestMapping(value = "/upload", method = RequestMethod.POST)
    @ResponseBody
    public OlsResult upload(@RequestParam("file") MultipartFile file, HttpServletRequest request) {
        InputStream inputStream;
        String path = "";
        String[] strings;
        try {
            inputStream = file.getInputStream();
            if (inputStream != null) {
                strings = FastDFSUtil.uploadFile(inputStream, file.getName(), file.getSize());
                if (strings != null && strings.length == 2) {
                    path = strings[0] + strings[1];
                }
                inputStream.close();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        if (StringUtils.hasLength(path)) {
            return OlsResult.ok(path);
        } else {
            return OlsResult.build(500, "上传失败,请稍后再试!");
        }
    }

    /**
     * 通过文件路径获取文件Byte数组的方法
     *
     * @param path 文件路径
     */
    private void getFileBytes(HttpServletResponse response, String path) {

        ServletOutputStream outputStream = null;
        try {
            outputStream = response.getOutputStream();
            byte[] bytes = FastDFSUtil.downloadFile(group, path);
            outputStream.write(bytes);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (outputStream != null) {
                try {
                    outputStream.flush();
                    outputStream.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }

}
