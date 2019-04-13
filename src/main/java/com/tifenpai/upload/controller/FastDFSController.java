package com.tifenpai.upload.controller;

import com.tifenpai.upload.common.utils.FastDFSUtil;
import com.tifenpai.upload.common.utils.OlsResult;
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
public class FastDFSController {


    @Value("${dfs.host}")
    private String host;
    @Value("${dfs.group}")
    private String group;
    @Value("${dfs.filePath}")
    private String filePath;


    @GetMapping("/{path1}/{path2}")
    @ResponseBody
    public OlsResult download(HttpServletResponse response, @PathVariable String path1, @PathVariable String path2) {
        String s = path1 + "/" + path2;
        System.out.println(path1 + path2);
        return OlsResult.ok(s);
    }

    @GetMapping("/{path1}/{path2}/{path3}")
    @ResponseBody
    public OlsResult download(HttpServletResponse response, @PathVariable String path1, @PathVariable String path2, @PathVariable String path3) {
        String s = path1 + "/" + path2 + "/" + path3;
        try {
            ServletOutputStream outputStream = response.getOutputStream();
            byte[] bytes = FastDFSUtil.downloadFile(group, filePath);
            outputStream.write(bytes);
            outputStream.flush();
            outputStream.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return OlsResult.ok(s);
    }


    @GetMapping("/download")
    @ResponseBody
    public void download(String uri, HttpServletResponse response) {

        String[] split = uri.split("-");
        ServletOutputStream outputStream = null;
        try {
            outputStream = response.getOutputStream();

            byte[] bytes = FastDFSUtil.downloadFile(split[0], split[1]);
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

    @RequestMapping(value = "/upload", method = RequestMethod.POST)
    @ResponseBody
    public OlsResult upload(@RequestParam("file") MultipartFile file, HttpServletRequest request) {

        InputStream fileInputStream = null;
        String fileUrl = "";
        try {
            fileInputStream = file.getInputStream();
            String[] strings = FastDFSUtil.uploadFile(fileInputStream, file.getName(), file.getSize());
            if (strings != null && strings.length == 2) {
                fileUrl = host + "/" + strings[0] + "/" + strings[1];
            }
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            if (fileInputStream != null) {
                try {
                    fileInputStream.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
        if (StringUtils.hasLength(fileUrl)) {
            return OlsResult.ok(fileUrl);
        } else {
            return OlsResult.build(500, "获取文件失败!!!");
        }
    }

}
