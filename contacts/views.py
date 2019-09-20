from django.shortcuts import render
from rest_framework.parsers import FileUploadParser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from .serializers import ContactSerializer
from .models import Contact
from django.shortcuts import get_object_or_404
from datetime import datetime
# Create your views here.


class ContactDetailView(APIView):
    parser_class = (FileUploadParser,)

    def get(self, request, pk):
        contact = get_object_or_404(
            Contact, pk=pk, posted_by=request.user.id, deletion_date=None)
        serializer = ContactSerializer(contact)
        return Response(serializer.data)

    def patch(self, request, pk, *args, **kwargs):
        contact = get_object_or_404(
            Contact, pk=pk, posted_by=request.user.id, deletion_date=None)

        serializer = ContactSerializer(
            contact, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        contact = get_object_or_404(Contact, pk=pk, posted_by=request.user.id)
        date_today = datetime.now()
        serializer = ContactSerializer(
            contact, data={"deletion_date": date_today}, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(serializer.errors, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ContactListView(APIView):
    parser_class = (FileUploadParser,)

    def post(self, request, *args, **kwargs):
        request.data['posted_by'] = request.user.id
        contact_serializer = ContactSerializer(data=request.data)

        if contact_serializer.is_valid():
            contact_serializer.save()
            return Response(contact_serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(contact_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        queryset = Contact.objects.filter(
            posted_by=request.user.id, deletion_date=None)
        serializer = ContactSerializer(queryset, many=True)
        return Response(serializer.data)
