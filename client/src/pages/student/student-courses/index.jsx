import axiosInstance from "@/axiosInstance";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import { Watch } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function StudentCoursesPage() {
  const { auth } = useContext(AuthContext);
  const { studentBoughtCoursesList, setStudentBoughtCoursesList } =
    useContext(StudentContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true); // 🔸 Added loading state

  async function fetchStudentBoughtCoursesServices(studentId) {
    const { data } = await axiosInstance.get(
      `/student/courses-bought/get/${studentId}`
    );
    return data;
  }

  useEffect(() => {
    async function fetchStudentBoughtCourses() {
      try {
        const response = await fetchStudentBoughtCoursesServices(
          auth?.user?._id
        );
        if (response?.success) {
          setStudentBoughtCoursesList(response?.data);
        }
      } catch (error) {
        console.error("Error fetching courses", error);
      } finally {
        setLoading(false); // 🔸 End loading
      }
    }

    fetchStudentBoughtCourses();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-8">My Courses</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {loading ? (
          <p className="text-lg">Loading...</p> // 🔸 Show loading text while fetching
        ) : studentBoughtCoursesList && studentBoughtCoursesList.length > 0 ? (
          studentBoughtCoursesList.map((course) => (
            <Card key={course.id} className="flex flex-col">
              <CardContent className="p-4 flex-grow">
                <img
                  src="https://blogassets.leverageedu.com/blog/wp-content/uploads/2020/05/23151218/BA-Courses.png"
                  alt={course?.title}
                  className="h-52 w-full object-cover rounded-md mb-4"
                />
                <h3 className="font-bold mb-1">{course?.title}</h3>
                <p className="text-sm text-gray-700 mb-2">
                  {course?.instructorName}
                </p>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={() =>
                    navigate(`/student/course-progress/${course?.courseId}`)
                  }
                  className="flex-1"
                >
                  <Watch className="mr-2 h-4 w-4" />
                  Start Watching
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <h1 className="text-3xl font-bold">No Courses found</h1>
        )}
      </div>
    </div>
  );
}

export default StudentCoursesPage;
