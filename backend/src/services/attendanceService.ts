import QRCode from 'qrcode';

class AttendanceService {
  async generateQR(courseId: string) {
    const data = JSON.stringify({
      courseId,
      timestamp: Date.now(),
      type: 'ATTENDANCE_TOKEN'
    });

    return QRCode.toDataURL(data);
  }

  async verifyAttendance(studentId: string, courseId: string, token: string) {
    // In a real app, you'd verify the token is still valid (e.g., within 5 mins)
    return true;
  }
}

export default new AttendanceService();
