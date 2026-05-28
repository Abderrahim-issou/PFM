import type { authReturnType, loginCredentials, registerCredentials } from "../types/Global";
import axiosPrivate from "../utils/axiosPrivate"

export const login = async(credentials: loginCredentials): Promise<authReturnType> => {
    const response = await axiosPrivate.post<authReturnType>('/auth/login', credentials);
    return response.data
}
export const register = async(credentials: registerCredentials): Promise<authReturnType> => {
    const response = await axiosPrivate.post<authReturnType>('/auth/register', credentials);
    return response.data; 
}

export const process_image = async (image: FormData, token: string) => {
    const response = await axiosPrivate.post(
        '/process_image', 
        image,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );
    return response;
}

export const getDiagnosticHistory = async (token: string) => {
  const response = await axiosPrivate.get(
    "/diagnostic-reports/history",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response;
};

export const getDiagnosticReportById = async (
  reportId: number,
  token: string
) => {
  const response = await axiosPrivate.get(
    `/diagnostic-reports/${reportId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response;
};

export const deleteDiagnosticReport = async (
  reportId: number,
  token: string
) => {
  const response = await axiosPrivate.delete(
    `/diagnostic-reports/${reportId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response;
};

export const createTrackedPlant = async (
  data: {
    name: string;
    icon?: string | null;
  },
  token: string
) => {
  const response = await axiosPrivate.post(
    "/tracked-plants/",
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response;
};

export const getTrackedPlants = async (token: string) => {
  const response = await axiosPrivate.get(
    "/tracked-plants/",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response;
};

export const getTrackedPlantDetails = async (
  plantId: number,
  token: string
) => {
  const response = await axiosPrivate.get(
    `/tracked-plants/${plantId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response;
};

export const scanTrackedPlant = async (
  plantId: number,
  image: FormData,
  token: string
) => {
  const response = await axiosPrivate.post(
    `/tracked-plants/${plantId}/scan`,
    image,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response;
};

export const deleteTrackedPlant = async (
  plantId: number,
  token: string
) => {
  const response = await axiosPrivate.delete(
    `/tracked-plants/${plantId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response;
};

export const getMyProfile = async (token: string) => {
  const response = await axiosPrivate.get("/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
};

export const updateMyProfile = async (
  data: {
    first_name?: string;
    last_name?: string;
  },
  token: string
) => {
  const response = await axiosPrivate.patch("/auth/me", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
};


export const getAnalyticsOverview = async (token: string) => {
  const response = await axiosPrivate.get("/analytics/overview", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
};
