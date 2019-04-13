package com.tifenpai.upload.common.utils;

import org.csource.common.NameValuePair;
import org.csource.fastdfs.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.io.InputStream;


/**
 * 基本操作
 *
 * @author waver
 */
@Component
public class FastDFSUtil {

    @Autowired
    private HttpServletRequest httpServletRequest;

    public FastDFSUtil() {

        String configFileName = "D:\\Config\\fdfs_client.conf";
        try {
            ClientGlobal.init(configFileName);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }




    /**
     * 上传文件
     */
    public static String[] uploadFile(InputStream inputStream, String uploadFileName, long fileLength) throws IOException {
        System.out.println("上传文件=======================");
        byte[] fileBuff = getFileBuffer(inputStream, fileLength);
        String[] files = null;
        String fileExtName = "";
        if (uploadFileName.contains(".")) {
            fileExtName = uploadFileName.substring(uploadFileName.lastIndexOf(".") + 1);
        } else {
            System.out.println("Fail to upload file, because the format of filename is illegal.");
            return null;
        }

        // 建立连接
        TrackerClient tracker = new TrackerClient();
        TrackerServer trackerServer = tracker.getConnection();
        StorageServer storageServer = null;
        StorageClient client = new StorageClient(trackerServer, storageServer);

        // 设置元信息
        NameValuePair[] metaList = new NameValuePair[3];
        metaList[0] = new NameValuePair("fileName", uploadFileName);
        metaList[1] = new NameValuePair("fileExtName", fileExtName);
        metaList[2] = new NameValuePair("fileLength", String.valueOf(fileLength));

        // 上传文件
        try {
            files = client.upload_file(fileBuff, fileExtName, metaList);
        } catch (Exception e) {
            System.out.println("Upload file \"" + uploadFileName + "\"fails");
        }
        trackerServer.close();
        return files;
    }

    private static byte[] getFileBuffer(InputStream inStream, long fileLength) throws IOException {

        byte[] buffer = new byte[256 * 1024];
        byte[] fileBuffer = new byte[(int) fileLength];

        int count = 0;
        int length = 0;

        while ((length = inStream.read(buffer)) != -1) {
            for (int i = 0; i < length; ++i) {
                fileBuffer[count + i] = buffer[i];
            }
            count += length;
        }
        return fileBuffer;
    }

    //下载文件
    public static byte[] downloadFile(String groupName, String filepath) throws Exception {
        System.out.println("下载文件=======================");
        TrackerClient tracker = new TrackerClient();
        TrackerServer trackerServer = tracker.getConnection();
        StorageServer storageServer = null;

        StorageClient storageClient = new StorageClient(trackerServer, storageServer);
        return storageClient.download_file(groupName, filepath);
//        System.out.println("文件大小:" + b.length);
//        String fileName = "D:/avder.jpg";
//        File download = new File(fileName);
//        FileOutputStream out = new FileOutputStream(download);
//        out.write(b);
//        return out;
//        out.flush();
//        out.close();
    }

    //查看文件信息
    public static void getFileInfo(String groupName, String filepath) throws Exception {
        System.out.println("获取文件信息=======================");
        TrackerClient tracker = new TrackerClient();
        TrackerServer trackerServer = tracker.getConnection();
        StorageServer storageServer = null;

        StorageClient storageClient = new StorageClient(trackerServer, storageServer);
        FileInfo fi = storageClient.get_file_info(groupName, filepath);
        System.out.println("所在服务器地址:" + fi.getSourceIpAddr());
        System.out.println("文件大小:" + fi.getFileSize());
        System.out.println("文件创建时间:" + fi.getCreateTimestamp());
        System.out.println("文件CRC32 signature:" + fi.getCrc32());
    }

    public static void getFileMate(String groupName, String filepath) throws Exception {
        System.out.println("获取文件Mate=======================");
        TrackerClient tracker = new TrackerClient();
        TrackerServer trackerServer = tracker.getConnection();
        StorageServer storageServer = null;

        StorageClient storageClient = new StorageClient(trackerServer, storageServer);
        NameValuePair nvps[] = storageClient.get_metadata(groupName, filepath);
        for (NameValuePair nvp : nvps) {
            System.out.println(nvp.getName() + ":" + nvp.getValue());
        }
    }

    public static void deleteFile(String groupName, String filepath) throws Exception {
        System.out.println("删除文件=======================");
        TrackerClient tracker = new TrackerClient();
        TrackerServer trackerServer = tracker.getConnection();
        StorageServer storageServer = null;
        StorageClient storageClient = new StorageClient(trackerServer, storageServer);
        int i = storageClient.delete_file(groupName, filepath);
        System.out.println(i == 0 ? "删除成功" : "删除失败:" + i);
    }
}